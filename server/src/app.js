import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.route.js";

const app = express();

// Adding middleware to parse JSON (req.body) data
app.use(express.json());
app.use(cookieParser());

/**
 * Mount routes into app
 * Signaling to the express: "when any request start with '/api/v1/auth' ,
 * send/route it to the 'authRoutes' router."
 */
app.use("/api/v1/auth", authRoutes);

export default app;
