class AppError extends Error {
  constructor(message, statusCode, detail = null) {
    super(message);
    this.statusCode = statusCode;
    this.ok = statusCode.toString().startsWith("2");
    this.detail = detail;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleValidationError = (error) => {
  const errors = error.details.map(({ context: { label }, message }) => ({
    field: label,
    message: message.replace(/['"]/g, ""),
  }));
  return new AppError("Validation failed", 422, errors);
};

const globalErrorHandler = (err, req, res, next) => {
  const {
    statusCode = 500,
    ok = false,
    message = "Internal Server Error",
    stack,
    detail,
  } = err;

  const response = { ok, message };

  if (detail) response.detail = detail;

  if (process.env.NODE_ENV === "development" && stack) response.stack = stack;

  res.status(statusCode).json(response);
};

module.exports = { AppError, handleValidationError, globalErrorHandler };
