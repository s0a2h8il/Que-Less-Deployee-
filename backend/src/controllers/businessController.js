import Business from "../models/Business.js";
import Queue from "../models/Queue.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build pagination meta object
// ─────────────────────────────────────────────────────────────────────────────
const paginate = (page, limit) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  return { pageNum, limitNum, skip: (pageNum - 1) * limitNum };
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new business
// @route   POST /api/business
// @access  Private (admin, superadmin)
// ─────────────────────────────────────────────────────────────────────────────
export const createBusiness = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    addressLine1,
    addressLine2,
    areaName,
    city,
    state,
    pincode,
    phone,
    email,
    openingTime,
    closingTime,
  } = req.body;

  if (!name || !category || !addressLine1 || !city)
    throw new ApiError(400, "Please provide name, category, address line 1 and city");

  const business = await Business.create({
    ownerId: req.user._id,
    name,
    category,
    description,
    addressLine1,
    addressLine2,
    areaName,
    city,
    state,
    pincode,
    phone,
    email,
    openingTime,
    closingTime,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { business }, "Business created successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get businesses managed by the current user
// @route   GET /api/business/my
// @access  Private (admin, superadmin)
// ─────────────────────────────────────────────────────────────────────────────
export const getMyBusinesses = asyncHandler(async (req, res) => {
  const filter = {
    isActive: true,
    ...(req.user.role !== "superadmin" ? { ownerId: req.user._id } : {}),
  };

  const businesses = await Business.find(filter)
    .populate("ownerId", "name email avatar")
    .sort({ createdAt: -1 })
    .lean();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { businesses },
        "Managed businesses fetched successfully",
      ),
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all businesses (public, with search/filter/pagination)
// @route   GET /api/business
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const getAllBusinesses = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    city,
    isVerified,
    page = 1,
    limit = 10,
  } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const filter = { isActive: true };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
    ];
  }
  if (category) filter.category = { $regex: `^${category}$`, $options: "i" };
  if (city) filter.city = { $regex: `^${city}$`, $options: "i" };
  if (isVerified !== undefined) filter.isVerified = isVerified === "true";

  const [businesses, total] = await Promise.all([
    Business.find(filter)
      .populate("ownerId", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Business.countDocuments(filter),
  ]);

  const businessIds = businesses.map((business) => business._id);
  let activeQueueByBusiness = new Map();

  if (businessIds.length > 0) {
    const activeQueues = await Queue.find({
      businessId: { $in: businessIds },
      status: "active",
    })
      .select("_id businessId status")
      .sort({ createdAt: -1 })
      .lean();

    activeQueueByBusiness = new Map(
      activeQueues.map((queue) => [queue.businessId.toString(), queue]),
    );
  }

  const enrichedBusinesses = businesses.map((business) => {
    const activeQueue = activeQueueByBusiness.get(business._id.toString());
    return {
      ...business,
      activeQueueId: activeQueue?._id || null,
      activeQueueStatus: activeQueue?.status || null,
    };
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        businesses: enrichedBusinesses,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalResults: total,
          limit: limitNum,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1,
        },
      },
      "Businesses fetched successfully",
    ),
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single business by ID
// @route   GET /api/business/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const getBusinessById = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id)
    .populate("ownerId", "name email avatar")
    .lean();
  if (!business) throw new ApiError(404, "Business not found");

  res
    .status(200)
    .json(new ApiResponse(200, { business }, "Business fetched successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a business
// @route   PUT /api/business/:id
// @access  Private (owner or superadmin)
// ─────────────────────────────────────────────────────────────────────────────
export const updateBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) throw new ApiError(404, "Business not found");

  const isOwner = business.ownerId.toString() === req.user._id.toString();
  const isSuperAdmin = req.user.role === "superadmin";
  if (!isOwner && !isSuperAdmin)
    throw new ApiError(403, "You are not authorized to update this business");

  const ALLOWED_FIELDS = [
    "name",
    "category",
    "description",
    "address",
    "city",
    "state",
    "phone",
    "email",
    "openingTime",
    "closingTime",
  ];
  if (isSuperAdmin) ALLOWED_FIELDS.push("isVerified", "isActive");

  const updates = {};
  for (const field of ALLOWED_FIELDS) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  if (Object.keys(updates).length === 0)
    throw new ApiError(400, "No valid fields provided for update");

  const updatedBusiness = await Business.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true },
  ).populate("ownerId", "name email avatar");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { business: updatedBusiness },
        "Business updated successfully",
      ),
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all unique categories currently in use
// @route   GET /api/business/categories
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Business.distinct("category", { isActive: true });
  
  res.status(200).json(
    new ApiResponse(
      200,
      { categories: categories.filter(Boolean) },
      "Categories fetched successfully"
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a business
// @route   DELETE /api/business/:id
// @access  Private (owner or superadmin)
// ─────────────────────────────────────────────────────────────────────────────
export const deleteBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) throw new ApiError(404, "Business not found");

  const isOwner = business.ownerId.toString() === req.user._id.toString();
  const isSuperAdmin = req.user.role === "superadmin";
  if (!isOwner && !isSuperAdmin)
    throw new ApiError(403, "You are not authorized to delete this business");

  // Cascade delete queues associated with this business
  await Queue.deleteMany({ businessId: business._id });

  await Business.findByIdAndDelete(req.params.id);

  res.status(200).json(new ApiResponse(200, null, "Business and associated queues deleted successfully"));
});
