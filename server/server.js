/*
import "dotenv/config";

import app from "./src/app.js";
import databaseConnection from "./src/common/config/db.connection.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  //connect to database
  await databaseConnection(); //code wait until the db operation completed

  app.listen(PORT, () => {
    console.log(
      `Server is listen on port: http://localhost:${PORT} in ${process.env.NODE_ENV} mode`,
    );
  });
};

start().catch((e) => {
  console.error("Failed to start server", e);
  process.exit(1);
});

*/

import "dotenv/config";
import app from "./src/app.js";
import databaseConnection from "./src/common/config/db.connection.js";
import mongoose from "mongoose"; // import Mongoose for close the connection

const PORT = process.env.PORT || 3000;
let server; // Store the server instance in global variable

const start = async () => {
  // connect to database
  await databaseConnection();

  // app.listen() returns the server object
  server = app.listen(PORT, () => {
    console.log(`Server is listen on port: http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
  });
};

start().catch((e) => {
  console.error("Failed to start server", e);
  process.exit(1);
});

// ==========================================
// GRACEFUL SHUTDOWN LOGIC
// ==========================================

const gracefulShutdown = async (signal) => {
  console.log(`\n[${signal}] signal received. Shutting down gracefully...`);

  if (server) {
    // 1. Stop accepting new HTTP requests
    server.close(async () => {
      console.log("HTTP server closed. No longer accepting new requests.");

      // 2. Close the database connection safely
      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed successfully.");
        // 3. Exit the Node.js process successfully (0 means success code)
        process.exit(0);
      } catch (error) {
        console.error("Error while closing MongoDB connection:", error);
        // Exit with failure code (1) if DB disconnection failed
        process.exit(1);
      }
    });
  } else {
    // If server is not started, exit the process
    process.exit(0);
  }
};

// Listen for termination signals from OS / Docker
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // Docker stop / Kubernetes
process.on("SIGINT", () => gracefulShutdown("SIGINT")); // Ctrl+C in terminal
