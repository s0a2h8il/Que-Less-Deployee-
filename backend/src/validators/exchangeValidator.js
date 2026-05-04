import { body } from "express-validator";
import mongoose from "mongoose";

export const exchangeValidator = [
  body("queueId")
    .notEmpty()
    .withMessage("Queue ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Queue ID"),
  
  body("toUser")
    .notEmpty()
    .withMessage("Target user ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid User ID"),

  body("message")
    .optional()
    .isString()
    .isLength({ max: 200 })
    .withMessage("Message cannot exceed 200 characters"),
];
