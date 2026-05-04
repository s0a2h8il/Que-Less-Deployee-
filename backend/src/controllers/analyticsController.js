import Queue from "../models/Queue.js";
import Business from "../models/Business.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper: Parse date strings
const parseDate = (dateString) => {
  return dateString ? new Date(dateString) : null;
};

// Helper: Get start and end of day
const getDateRange = (startDate, endDate) => {
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate ? new Date(endDate) : new Date();

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// ====== 1. OVERVIEW ANALYTICS ======
export const getOverviewAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, businessId } = req.query;
  const { start, end } = getDateRange(startDate, endDate);

  // Build query filter
  let queueQuery = {
    createdAt: { $gte: start, $lte: end },
  };

  if (businessId) {
    // Admin/Superadmin can filter by business
    if (req.user.role === "admin" || req.user.role === "superadmin") {
      queueQuery.business = businessId;
    } else if (req.user.role === "user") {
      // Users can't access analytics
      throw new ApiError(403, "Users cannot access analytics");
    }
  } else if (req.user.role === "admin") {
    // Admin sees only their business queues
    const adminBusiness = await Business.findOne({ ownerId: req.user._id });
    if (!adminBusiness) {
      throw new ApiError(404, "Business not found");
    }
    queueQuery.businessId = adminBusiness._id;
  }

  // Fetch queues
  const queues = await Queue.find(queueQuery).populate("businessId");

  // Calculate stats
  const totalQueues = queues.length;
  const activeQueues = queues.filter((q) => q.status === "active").length;
  const pausedQueues = queues.filter((q) => q.status === "paused").length;
  const closedQueues = queues.filter((q) => q.status === "closed").length;

  // Calculate waiting times
  let totalWaitingTime = 0;
  let waitingTimeCount = 0;
  let bestQueueWait = Infinity;
  let worstQueueWait = 0;
  let bestQueue = null;
  let worstQueue = null;

  queues.forEach((queue) => {
    if (queue.members && queue.members.length > 0) {
      let queueWaitingTime = 0;
      let memberCount = 0;

      queue.members.forEach((member) => {
        if (member.calledAt && member.joinedAt) {
          const wait =
            (new Date(member.calledAt) - new Date(member.joinedAt)) /
            (1000 * 60); // in minutes
          queueWaitingTime += wait;
          memberCount++;
        } else if (member.joinedAt) {
          // Estimate wait time as current time - joined time
          const wait = (new Date() - new Date(member.joinedAt)) / (1000 * 60);
          queueWaitingTime += wait;
          memberCount++;
        }
      });

      if (memberCount > 0) {
        const queueAverage = queueWaitingTime / memberCount;
        totalWaitingTime += queueAverage;
        waitingTimeCount++;

        if (queueAverage < bestQueueWait) {
          bestQueueWait = queueAverage;
          bestQueue = queue.title;
        }
        if (queueAverage > worstQueueWait) {
          worstQueueWait = queueAverage;
          worstQueue = queue.title;
        }
      }
    }
  });

  const avgWaitingTime =
    waitingTimeCount > 0 ? Math.round(totalWaitingTime / waitingTimeCount) : 0;

  // Calculate completion stats
  let totalCompleted = 0;
  let totalWaiting = 0;
  let totalLeft = 0;
  let totalSkipped = 0;

  queues.forEach((queue) => {
    if (queue.members) {
      queue.members.forEach((member) => {
        if (member.status === "completed") totalCompleted++;
        else if (member.status === "waiting") totalWaiting++;
        else if (member.status === "left") totalLeft++;
        else if (member.status === "skipped") totalSkipped++;
      });
    }
  });

  const totalUsers = totalCompleted + totalWaiting + totalLeft + totalSkipped;
  const completionRate =
    totalUsers > 0 ? Math.round((totalCompleted / totalUsers) * 100) : 0;

  // Response
  const overview = {
    dateRange: { start, end },
    queueStats: {
      totalQueues,
      activeQueues,
      pausedQueues,
      closedQueues,
    },
    waitingTime: {
      average: avgWaitingTime,
      best: { queue: bestQueue, time: Math.round(bestQueueWait) },
      worst: { queue: worstQueue, time: Math.round(worstQueueWait) },
    },
    userStats: {
      totalCompleted,
      totalWaiting,
      totalLeft,
      totalSkipped,
      total: totalUsers,
      completionRate,
    },
  };

  res.json(
    new ApiResponse(200, overview, "Overview analytics fetched successfully"),
  );
});

// ====== 2. BUSINESS ANALYTICS ======
export const getBusinessAnalytics = asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { startDate, endDate } = req.query;
  const { start, end } = getDateRange(startDate, endDate);

  // Authorization check
  if (req.user.role === "admin") {
    // Check if this specific business belongs to the admin
    const adminBusiness = await Business.findOne({ _id: businessId, ownerId: req.user._id });
    if (!adminBusiness) {
      throw new ApiError(403, "You can only view your own business analytics");
    }
  } else if (req.user.role !== "superadmin") {
    throw new ApiError(
      403,
      "Only admin or superadmin can access business analytics",
    );
  }

  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  const queues = await Queue.find({
    businessId: businessId,
    createdAt: { $gte: start, $lte: end },
  });

  let totalJoined = 0;
  let totalCompleted = 0;
  let totalWaiting = 0;
  let totalWaitingTime = 0;
  let waitingTimeCount = 0;

  queues.forEach((queue) => {
    if (queue.members) {
      queue.members.forEach((member) => {
        totalJoined++;

        if (member.status === "completed") {
          totalCompleted++;
          if (member.calledAt && member.joinedAt) {
            const wait =
              (new Date(member.calledAt) - new Date(member.joinedAt)) /
              (1000 * 60);
            totalWaitingTime += wait;
            waitingTimeCount++;
          }
        } else if (member.status === "waiting") {
          totalWaiting++;
        }
      });
    }
  });

  const avgWaitTime =
    waitingTimeCount > 0 ? Math.round(totalWaitingTime / waitingTimeCount) : 0;
  const completionRate =
    totalJoined > 0 ? Math.round((totalCompleted / totalJoined) * 100) : 0;

  const businessAnalytics = {
    businessName: business.name,
    businessId: business._id,
    dateRange: { start, end },
    queues: {
      total: queues.length,
      active: queues.filter((q) => q.status === "active").length,
      paused: queues.filter((q) => q.status === "paused").length,
      closed: queues.filter((q) => q.status === "closed").length,
    },
    users: {
      totalJoined,
      totalCompleted,
      totalWaiting,
      completionRate,
    },
    performance: {
      avgWaitingTime: avgWaitTime,
      queuesCount: queues.length,
    },
  };

  res.json(
    new ApiResponse(
      200,
      businessAnalytics,
      "Business analytics fetched successfully",
    ),
  );
});

// ====== 3. QUEUE ANALYTICS ======
export const getQueueAnalytics = asyncHandler(async (req, res) => {
  const { businessId, startDate, endDate } = req.query;
  const { start, end } = getDateRange(startDate, endDate);

  let queueQuery = { createdAt: { $gte: start, $lte: end } };

  if (businessId) {
    // Authorization for business filter
    if (req.user.role === "admin") {
      const adminBusiness = await Business.findOne({ owner: req.user._id });
      if (!adminBusiness || adminBusiness._id.toString() !== businessId) {
        throw new ApiError(
          403,
          "You can only view your own business analytics",
        );
      }
    }
    queueQuery.business = businessId;
  } else if (req.user.role === "admin") {
    // Admin sees only their queues
    const adminBusiness = await Business.findOne({ ownerId: req.user._id });
    if (!adminBusiness) {
      throw new ApiError(404, "Business not found");
    }
    queueQuery.businessId = adminBusiness._id;
  }

  const queues = await Queue.find(queueQuery).populate("businessId");

  const queueAnalytics = queues.map((queue) => ({
    id: queue._id,
    title: queue.title,
    businessName: queue.business?.name,
    status: queue.status,
    totalMembers: queue.members?.length || 0,
    completedMembers:
      queue.members?.filter((m) => m.status === "completed").length || 0,
    waitingMembers:
      queue.members?.filter((m) => m.status === "waiting").length || 0,
    leftMembers: queue.members?.filter((m) => m.status === "left").length || 0,
    avgWaitingTime: calculateQueueAvgWait(queue),
    completionRate: calculateQueueCompletionRate(queue),
  }));

  res.json(
    new ApiResponse(
      200,
      queueAnalytics,
      "Queue analytics fetched successfully",
    ),
  );
});

// ====== 4. PEAK HOURS ANALYTICS ======
export const getPeakHours = asyncHandler(async (req, res) => {
  const { businessId, startDate, endDate } = req.query;
  const { start, end } = getDateRange(startDate, endDate);

  let queueQuery = { createdAt: { $gte: start, $lte: end } };

  if (businessId) {
    if (req.user.role === "admin") {
      const adminBusiness = await Business.findOne({ owner: req.user._id });
      if (!adminBusiness || adminBusiness._id.toString() !== businessId) {
        throw new ApiError(
          403,
          "You can only view your own business analytics",
        );
      }
    }
    queueQuery.business = businessId;
  } else if (req.user.role === "admin") {
    const adminBusiness = await Business.findOne({ ownerId: req.user._id });
    if (!adminBusiness) {
      throw new ApiError(404, "Business not found");
    }
    queueQuery.businessId = adminBusiness._id;
  }

  const queues = await Queue.find(queueQuery);

  // Calculate hourly data
  const hourlyData = Array(24).fill(0);

  queues.forEach((queue) => {
    if (queue.members) {
      queue.members.forEach((member) => {
        if (member.joinedAt) {
          const hour = new Date(member.joinedAt).getHours();
          hourlyData[hour]++;
        }
      });
    }
  });

  // Convert to chart format
  const peakHoursData = hourlyData.map((count, hour) => ({
    hour: `${hour.toString().padStart(2, "0")}:00`,
    joins: count,
  }));

  // Find peak hour
  const peakHour = Math.max(...hourlyData);
  const peakHourIndex = hourlyData.indexOf(peakHour);

  res.json(
    new ApiResponse(
      200,
      {
        peakHoursData,
        peakHour: {
          time: `${peakHourIndex.toString().padStart(2, "0")}:00`,
          joins: peakHour,
        },
      },
      "Peak hours analytics fetched successfully",
    ),
  );
});

// ====== 5. COMPLETION RATE ANALYTICS ======
export const getCompletionRate = asyncHandler(async (req, res) => {
  const { businessId, startDate, endDate } = req.query;
  const { start, end } = getDateRange(startDate, endDate);

  let queueQuery = { createdAt: { $gte: start, $lte: end } };

  if (businessId) {
    if (req.user.role === "admin") {
      const adminBusiness = await Business.findOne({ owner: req.user._id });
      if (!adminBusiness || adminBusiness._id.toString() !== businessId) {
        throw new ApiError(
          403,
          "You can only view your own business analytics",
        );
      }
    }
    queueQuery.business = businessId;
  } else if (req.user.role === "admin") {
    const adminBusiness = await Business.findOne({ ownerId: req.user._id });
    if (!adminBusiness) {
      throw new ApiError(404, "Business not found");
    }
    queueQuery.businessId = adminBusiness._id;
  }

  const queues = await Queue.find(queueQuery);

  let completed = 0;
  let waiting = 0;
  let left = 0;
  let skipped = 0;

  queues.forEach((queue) => {
    if (queue.members) {
      queue.members.forEach((member) => {
        if (member.status === "completed") completed++;
        else if (member.status === "waiting") waiting++;
        else if (member.status === "left") left++;
        else if (member.status === "skipped") skipped++;
      });
    }
  });

  const total = completed + waiting + left + skipped;

  const completionData = [
    {
      name: "Completed",
      value: completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    },
    {
      name: "Waiting",
      value: waiting,
      percentage: total > 0 ? Math.round((waiting / total) * 100) : 0,
    },
    {
      name: "Left",
      value: left,
      percentage: total > 0 ? Math.round((left / total) * 100) : 0,
    },
    {
      name: "Skipped",
      value: skipped,
      percentage: total > 0 ? Math.round((skipped / total) * 100) : 0,
    },
  ];

  res.json(
    new ApiResponse(
      200,
      {
        completionData,
        total,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
      "Completion rate analytics fetched successfully",
    ),
  );
});

// ====== HELPER FUNCTIONS ======
function calculateQueueAvgWait(queue) {
  if (!queue.members || queue.members.length === 0) return 0;

  let totalWait = 0;
  let count = 0;

  queue.members.forEach((member) => {
    if (member.calledAt && member.joinedAt) {
      const wait =
        (new Date(member.calledAt) - new Date(member.joinedAt)) / (1000 * 60);
      totalWait += wait;
      count++;
    }
  });

  return count > 0 ? Math.round(totalWait / count) : 0;
}

function calculateQueueCompletionRate(queue) {
  if (!queue.members || queue.members.length === 0) return 0;

  const completed = queue.members.filter(
    (m) => m.status === "completed",
  ).length;
  return Math.round((completed / queue.members.length) * 100);
}
