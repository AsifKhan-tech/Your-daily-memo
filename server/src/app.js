import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.route.js";

const app = express();

// Adding middleware to parse JSON (req.body) data
app.use(express.json());
app.use(cookieParser());

// Mount routes into app

// Express ko bata rahe hain: "Jab bhi koi request '/api/v1/auth' se shuru ho,
// toh usko 'authRoutes' wale Router ke paas bhej do."
app.use("/api/v1/auth", authRoutes);

export default app;
