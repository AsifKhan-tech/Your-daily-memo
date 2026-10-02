import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database has been connected", dbConnection.connection.host);
  } catch (error) {
    console.error("Failed to connect with database", error);
  }
};

export default connectDB;
