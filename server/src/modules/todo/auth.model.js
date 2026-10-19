import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    todoValue: {
      type: String,
      trim: true,
      require: [true, "Todo is required"],
    },
  },
  { timestamps: true },
);

export default todoSchema;
