import { body, query, param } from "express-validator";
import { validateRequest } from "../middleware/validateRequest.js";

// Validate business ID parameter
export const businessIdParamValidator = [
  param("businessId")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid business ID format"),
  validateRequest,
];

// Validate date range query parameters
export const dateRangeValidator = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date format"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date format"),
  validateRequest,
];

// Validate analytics query params (date range + optional business filter)
export const analyticsQueryValidator = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date format"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date format"),
  query("businessId")
    .optional()
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid business ID format"),
  validateRequest,
];

// Combine business ID parameter + analytics query validation
export const businessAnalyticsValidator = [
  ...businessIdParamValidator,
  ...analyticsQueryValidator.slice(0, -1), // Remove validateRequest from middle, add at end
];
