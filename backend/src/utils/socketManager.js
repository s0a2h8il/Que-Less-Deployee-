import { notificationService } from "./notificationService.js";

let io;

/**
 * Initialize and store the Socket.io instance
 * @param {object} ioInstance - The Socket.io server instance
 */
export const setSocketInstance = (ioInstance) => {
  io = ioInstance;
  console.log("🔌 Socket.io instance stored in Manager");
};

/**
 * Get the stored Socket.io instance
 * @returns {object} The Socket.io server instance
 */
export const getSocketInstance = () => {
  if (!io) {
    console.error("❌ Socket.io NOT initialized yet!");
  }
  return io;
};

/**
 * Helper to emit queue updates to a specific room
 * @param {object} queue - The queue document
 * @param {string} message - A friendly message
 */
export const emitQueueUpdated = (queue, message = "Queue updated") => {
  if (!io) return;

  const waitingCount = queue.members.filter((m) => m.status === "waiting").length;

  const payload = {
    queueId: queue._id,
    status: queue.status,
    currentToken: queue.currentToken,
    waitingCount,
    estimatedWaitTime: waitingCount * queue.estimatedTimePerUser,
    updatedAt: queue.updatedAt,
    message,
  };

  io.to(`queue:${queue._id}`).emit("queueUpdated", payload);
  console.log(`📡 Emitted queueUpdated to room: queue:${queue._id}`);
};

/**
 * Helper to notify users when their turn is near (position <= 3)
 * @param {object} queue - The queue document
 */
export const emitTurnNear = (queue) => {
  if (!io) return;

  const waitingMembers = queue.members
    .filter((m) => m.status === "waiting")
    .sort((a, b) => a.tokenNumber - b.tokenNumber);

  waitingMembers.forEach((member, index) => {
    const position = index + 1;
    if (position <= 3) {
      const payload = {
        queueId: queue._id,
        tokenNumber: member.tokenNumber,
        position,
        message: position === 1 ? "You are next in line!" : `Your turn is near! Position: ${position}`,
      };

      io.to(`user:${member.userId}`).emit("turnNear", payload);
      
      // 🔔 Persist Notification
      notificationService.notifyTurnNear(
        member.userId, 
        queue._id, 
        queue.title, 
        member.tokenNumber, 
        position
      ).catch(err => console.error("Notification Error:", err));

      console.log(`🔔 Emitted turnNear to user: ${member.userId} | Position: ${position}`);
    }
  });
};

/**
 * Helper to notify a specific user when they are called
 * @param {string} queueId - The queue ID
 * @param {object} calledMember - The member object that was called
 */
export const emitCalledNext = (queueId, calledMember) => {
  if (!io) return;

  const payload = {
    queueId,
    currentToken: calledMember.tokenNumber,
    tokenNumber: calledMember.tokenNumber,
    message: "It's your turn! Please proceed.",
  };

  // Notify everyone in the room about the new token
  io.to(`queue:${queueId}`).emit("calledNext", payload);

  // Notify the specific user privately
  io.to(`user:${calledMember.userId}`).emit("turnCalled", payload);
  
  // 🔔 Persist Notification
  notificationService.notifyTurnCalled(
    calledMember.userId, 
    queueId, 
    "the queue", // Title could be passed or fetched, using generic for now
    calledMember.tokenNumber
  ).catch(err => console.error("Notification Error:", err));

  console.log(`📣 Emitted turnCalled to user: ${calledMember.userId}`);
};

/**
 * Notify a user about a new exchange request
 */
export const emitExchangeRequest = (toUserId, payload) => {
  if (!io) return;
  io.to(`user:${toUserId}`).emit("exchangeRequestReceived", payload);
};

/**
 * Notify both parties about an accepted exchange
 */
export const emitExchangeAccepted = (fromUserId, toUserId, payload) => {
  if (!io) return;
  io.to(`user:${fromUserId}`).emit("exchangeAccepted", payload);
  io.to(`user:${toUserId}`).emit("exchangeAccepted", payload);
};

/**
 * Notify the sender about a rejected exchange
 */
export const emitExchangeRejected = (fromUserId, payload) => {
  if (!io) return;
  io.to(`user:${fromUserId}`).emit("exchangeRejected", payload);
};
