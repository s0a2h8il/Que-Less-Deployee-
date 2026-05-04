import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to handle 404 Not Found errors for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export { notFound };
