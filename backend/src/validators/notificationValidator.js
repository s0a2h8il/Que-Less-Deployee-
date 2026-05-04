/**
 * Notification Validators
 * Validates notification-related requests
 */

import { param, query } from "express-validator";
import mongoose from "mongoose";

/**
 * Validator for notification ID parameter
 * Ensures notification ID is a valid MongoDB ObjectId
 */
export const notificationIdValidator = [
  param("notificationId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid notification ID format");
    }
    return true;
  }),
];

/**
 * Validator for notification query parameters
 * Validates optional filter parameters
 */
export const notificationQueryValidator = [
  query("type")
    .optional()
    .isIn([
      "queue_update",
      "business_notification",
      "exchange_request",
      "system_notification",
    ])
    .withMessage(
      "Type must be one of: queue_update, business_notification, exchange_request, system_notification",
    ),

  query("read")
    .optional()
    .isBoolean()
    .withMessage("Read must be a boolean value"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

export default { notificationIdValidator, notificationQueryValidator };
