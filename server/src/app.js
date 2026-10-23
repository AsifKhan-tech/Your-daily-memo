import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.route.js";
import ApiError from "./common/utils/api-error.js";

const app = express();

// Adding middleware to parse JSON (req.body) data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * It will parse client's cookies and wrap them in 'req.cookies'
 * when a client do request, the browser automatically send cookies with the request
 */
app.use(cookieParser());

/**
 * Mount routes into app
 * Signaling to the express: "when any request start with '/api/v1/auth' ,
 * send/route it to the 'authRoutes' router."
 */
app.use("/api/v1/auth", authRoutes);

/**
 * Global Catch-All (404 Fallback) Route.
 *
 * Intercepts all unmatched HTTP requests (GET, POST, PUT, etc.) for any undefined endpoint.
 * Throws a 404 Not Found error, which is then automatically forwarded to the global error-handling middleware for a consistent JSON response.
 */
app.all("{*path}", (req, res) => {
  throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
