import { body, param } from "express-validator";
import mongoose from "mongoose";

export const queueValidator = [
  body("businessId")
    .trim()
    .notEmpty().withMessage("Business ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid Business ID format"),
  
  body("title")
    .trim()
    .notEmpty().withMessage("Queue title is required")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
  
  body("estimatedTimePerUser")
    .optional()
    .isInt({ min: 1 }).withMessage("Estimated time must be a positive integer (minutes)"),
  
  body("maxUsers")
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage("Max users must be between 1 and 1000"),
];

export const statusUpdateValidator = [
  body("status")
    .trim()
    .notEmpty().withMessage("Status is required")
    .isIn(["waiting", "called", "completed", "left", "skipped", "cancelled"])
    .withMessage("Invalid status. Allowed: waiting, called, completed, left, skipped, cancelled"),
];
