import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI.trim();
    if (!uri) {
      throw new Error("MONGODB_URI is missing. Set it in your .env file");
    }
    const dbConnection = await mongoose.connect(uri);

    console.log(
      "Database has been connected with host:",
      dbConnection.connection.host,
    );
  } catch (error) {
    console.error("Failed to connect with database: ", error);
  }
};

export default connectDB;
