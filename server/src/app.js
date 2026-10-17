import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.route.js";

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

export default app;
