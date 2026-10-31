class ApiError extends Error {
  constructor(statusCode, message, code = "API_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request") {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static conflict(message = "Conflict - user already exists") {
    return new ApiError(409, message);
  }

  static forbidden(message = "forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "account not found") {
    return new ApiError(404, message);
  }

  static internal(message = "Failed to send verification email. Please try again!") {
    return new ApiError(500, message);
  }
}

export default ApiError;
