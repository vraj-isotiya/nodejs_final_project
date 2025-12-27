/**
 * Global Error Handler Middleware
 * MUST be the last middleware in app.js
 */
export const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  /**
   * Mongoose: Invalid ObjectId
   */
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  /**
   * Mongoose: Duplicate key error
   */
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  /**
   * Mongoose: Validation error
   */
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  /**
   * JWT errors
   */
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  /**
   * Stripe errors (do not expose internals)
   */
  if (err.type === "StripeCardError") {
    statusCode = 402;
    message = err.message;
  }

  /**
   * Final response
   */
  console.error(err.stack);
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};
