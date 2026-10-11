import express from "express";
import authRoutes from "./modules/auth/auth.route.js";

const app = express();

// Adding middleware to parse JSON (req.body) data
app.use(express.json());

// Mount routes into app

// Express ko bata rahe hain: "Jab bhi koi request '/api/auth' se shuru ho,
// toh usko 'authRoutes' wale Router ke paas bhej do."
app.use("/api/v1/auth", authRoutes);

export default app;
