import { body, param } from "express-validator";

// Validate delete business request
export const deleteBusinessValidator = [
  body("permanent")
    .optional()
    .isBoolean()
    .withMessage("Permanent must be a boolean"),
];

// Validate delete queue request
export const deleteQueueValidator = [
  body("permanent")
    .optional()
    .isBoolean()
    .withMessage("Permanent must be a boolean"),
];

// Validate business ID in params
export const businessIdValidator = [
  param("id")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid Business ID format"),
];

// Validate queue ID in params
export const queueIdValidator = [
  param("id")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid Queue ID format"),
];
