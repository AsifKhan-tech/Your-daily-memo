import express from "express";

const app = express();

// Adding middleware to parse JSON (req.body) data
app.use(express.json());

// Mount routes into app
app.use("/api/v1/auth");

export default app;
