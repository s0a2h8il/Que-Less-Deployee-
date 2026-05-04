import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Handle Mongoose Duplicate Key Error (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(409, `User with this ${field} already exists`);
  }

  // 2. Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message).join(", ");
    error = new ApiError(400, message);
  }

  // 3. Handle Mongoose CastError (Invalid ObjectId)
  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // 4. Handle JWT Errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token, authorization denied");
  }
  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired, please login again");
  }

  // 5. Ensure it's an instance of ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // 6. Final Response
  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors?.length > 0 ? { errors: error.errors } : {}),
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
