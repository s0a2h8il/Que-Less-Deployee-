import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to check for validation errors from express-validator
 * and throw an ApiError if any exist.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    throw new ApiError(422, "Validation Failed", extractedErrors);
  }
  
  next();
};

export { validateRequest };
