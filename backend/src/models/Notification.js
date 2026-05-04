import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "turn_near",
        "turn_called",
        "queue_updated",
        "queue_paused",
        "queue_resumed",
        "queue_closed",
        "exchange_request",
        "exchange_accepted",
        "exchange_rejected",
        "system",
      ],
      required: true,
    },
    relatedQueue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
    },
    relatedExchange: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExchangeRequest",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    metadata: {
      type: mongoose.Schema.Types.Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index for unread count optimization
notificationSchema.index({ userId: 1, isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
