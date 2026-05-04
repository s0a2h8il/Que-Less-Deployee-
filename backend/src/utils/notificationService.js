import Notification from "../models/Notification.js";
import { getSocketInstance } from "./socketManager.js";

/**
 * Service to handle notification creation and emission
 */
export const notificationService = {
  /**
   * Create a notification and emit socket event
   */
  createNotification: async (data) => {
    const notification = await Notification.create(data);
    
    // Emit to user's private room
    const io = getSocketInstance();
    if (io) {
      io.to(`user:${data.userId}`).emit("notification:new", notification);
      
      // Also emit unread count update
      const unreadCount = await Notification.countDocuments({ userId: data.userId, isRead: false });
      io.to(`user:${data.userId}`).emit("notification:unreadCount", { unreadCount });
    }
    
    return notification;
  },

  /**
   * Bulk create notifications for multiple users
   */
  createBulkNotifications: async (notifications) => {
    const created = await Notification.insertMany(notifications);
    const io = getSocketInstance();
    
    if (io) {
      // For each user, we could emit individually or just rely on them fetching
      // Given it's a MERN app, individual emits are better for UX
      for (const note of created) {
        io.to(`user:${note.userId}`).emit("notification:new", note);
        // Optimization: Unread count could be throttled or emitted less frequently
      }
    }
    return created;
  },

  /**
   * Alert user when their turn is near (position <= 3)
   */
  notifyTurnNear: async (userId, queueId, queueTitle, tokenNumber, position) => {
    return await notificationService.createNotification({
      userId,
      title: "Your turn is near!",
      message: `You are at position #${position} in '${queueTitle}'. Please be ready.`,
      type: "turn_near",
      relatedQueue: queueId,
      metadata: { tokenNumber, position }
    });
  },

  /**
   * Alert user when they are called
   */
  notifyTurnCalled: async (userId, queueId, queueTitle, tokenNumber) => {
    return await notificationService.createNotification({
      userId,
      title: "It's your turn!",
      message: `Token #${tokenNumber} has been called for '${queueTitle}'. Please proceed.`,
      type: "turn_called",
      relatedQueue: queueId,
      metadata: { tokenNumber }
    });
  },

  /**
   * Notify multiple users about queue status change
   */
  notifyQueueStatus: async (userIds, queueId, queueTitle, status) => {
    const statusMessages = {
      paused: "has been paused temporarily.",
      resumed: "is now active again.",
      closed: "has been closed for today."
    };

    const typeMap = {
      paused: "queue_paused",
      resumed: "queue_resumed",
      closed: "queue_closed"
    };

    const notifications = userIds.map(id => ({
      userId: id,
      title: `Queue ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `The queue '${queueTitle}' ${statusMessages[status]}`,
      type: typeMap[status] || "queue_updated",
      relatedQueue: queueId,
      metadata: { status }
    }));

    return await notificationService.createBulkNotifications(notifications);
  },

  /**
   * Notify about exchange request
   */
  notifyExchangeRequest: async (toUser, fromUserName, exchangeId, queueId, queueTitle, fromToken, yourToken) => {
    return await notificationService.createNotification({
      userId: toUser,
      title: "New Exchange Request",
      message: `${fromUserName} (Token #${fromToken}) wants to swap spots with you (Token #${yourToken}) in '${queueTitle}'.`,
      type: "exchange_request",
      relatedQueue: queueId,
      relatedExchange: exchangeId,
      metadata: { fromUserName, fromToken, yourToken }
    });
  },

  /**
   * Notify about exchange acceptance
   */
  notifyExchangeAccepted: async (fromUser, toUserName, exchangeId, queueId, queueTitle, newToken) => {
    return await notificationService.createNotification({
      userId: fromUser,
      title: "Exchange Accepted!",
      message: `${toUserName} accepted your swap request in '${queueTitle}'. Your new token is #${newToken}.`,
      type: "exchange_accepted",
      relatedQueue: queueId,
      relatedExchange: exchangeId,
      metadata: { toUserName, newToken }
    });
  },

  /**
   * Notify about exchange rejection
   */
  notifyExchangeRejected: async (fromUser, toUserName, exchangeId, queueId, queueTitle) => {
    return await notificationService.createNotification({
      userId: fromUser,
      title: "Exchange Rejected",
      message: `${toUserName} declined your swap request in '${queueTitle}'.`,
      type: "exchange_rejected",
      relatedQueue: queueId,
      relatedExchange: exchangeId,
      metadata: { toUserName }
    });
  }
};
