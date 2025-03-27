const errorHandler = (err, req, res, next) => {
  // Determine the status code (use existing or default to 500)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log the error stack in development
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Prepare error response
  const errorResponse = {
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  // Handle Sequelize database errors
  if (err.name === "SequelizeValidationError") {
    errorResponse.message = err.errors.map((e) => e.message).join(", ");
    statusCode = 400;
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    errorResponse.message = err.errors.map((e) => e.message).join(", ");
    statusCode = 409; // Conflict
  }

  if (err.name === "SequelizeDatabaseError") {
    errorResponse.message = "Database operation failed";
    statusCode = 500;
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    errorResponse.message = "Related record not found";
    statusCode = 400;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    errorResponse.message = "Invalid token";
    statusCode = 401;
  }

  // Handle JWT expired error
  if (err.name === "TokenExpiredError") {
    errorResponse.message = "Token expired";
    statusCode = 401;
  }

  // Handle 404 errors explicitly passed
  if (err.statusCode === 404) {
    statusCode = 404;
    errorResponse.message = err.message || "Resource not found";
  }

  // Send the error response
  res.status(statusCode).json({
    success: false,
    error: errorResponse,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      originalError: process.env.NODE_ENV === "development" ? err : undefined,
    }),
  });
};

module.exports = { errorHandler };
