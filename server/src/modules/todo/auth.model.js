import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    todoValue: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export default todoSchema;
