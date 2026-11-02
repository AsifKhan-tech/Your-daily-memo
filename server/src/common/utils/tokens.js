import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import ApiError from "./api-error.js";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15min",
  });
};

//it will return the decoded payload object
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Access token expired", "ACCESS_TOKEN_EXPIRED");
    }
    throw ApiError.unauthorized("Invalid access token", "INVALID_ACCESS_TOKEN");
  }
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

//it will return the decoded payload object
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Refresh token expired. Please login", "REFRESH_TOKEN_EXPIRED");
    }

    if (error.name === "JsonWebTokenError") {
      throw ApiError.unauthorized("Invalid refresh token.", "INVALID_REFRESH_TOKEN");
    }

    throw ApiError.unauthorized("Unable to verify refresh token.", "INVALID_REFRESH_TOKEN");
  }
};

const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  return { rawToken, hashedToken };
};

export { verifyAccessToken, verifyRefreshToken, generateAccessToken, generateRefreshToken, generateResetToken };
