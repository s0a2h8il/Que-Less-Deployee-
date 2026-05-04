import mongoose from "mongoose";

const queueMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tokenNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["waiting", "called", "completed", "left", "skipped", "cancelled"],
    default: "waiting",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  leftAt: Date,
  calledAt: Date,
  completedAt: Date,
  skippedAt: Date,
});

const queueSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: [true, "Business ID is required"],
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator ID is required"],
    },
    title: {
      type: String,
      required: [true, "Queue title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "closed"],
      default: "active",
      index: true,
    },
    closedAt: Date,
    currentToken: {
      type: Number,
      default: 0,
    },
    nextTokenNumber: {
      type: Number,
      default: 1,
    },
    estimatedTimePerUser: {
      type: Number,
      default: 5, // in minutes
    },
    maxUsers: {
      type: Number,
      default: 100,
    },
    members: [queueMemberSchema],
  },
  {
    timestamps: true,
  }
);

// ─── Indexes for performance ──────────────────────────────────────────────────
queueSchema.index({ businessId: 1, status: 1 });
queueSchema.index({ "members.userId": 1, status: 1 }); // To quickly check if user is in any active queue

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;
