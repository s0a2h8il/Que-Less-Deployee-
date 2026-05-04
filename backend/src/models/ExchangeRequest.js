import mongoose from "mongoose";

const exchangeRequestSchema = new mongoose.Schema(
  {
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fromTokenNumber: {
      type: Number,
      required: true,
    },
    toTokenNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
    message: {
      type: String,
      maxlength: 200,
    },
    acceptedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster lookups
exchangeRequestSchema.index({ queueId: 1, status: 1 });
exchangeRequestSchema.index({ fromUser: 1 });
exchangeRequestSchema.index({ toUser: 1 });

const ExchangeRequest = mongoose.model("ExchangeRequest", exchangeRequestSchema);

export default ExchangeRequest;
