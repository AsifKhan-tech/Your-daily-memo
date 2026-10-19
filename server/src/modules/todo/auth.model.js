import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    todoValue: {
      type: String,
      trim: true,
      require: [true, "Todo is required"],
      minlength: 1,
      maxlength: 200,
    },
  },
  { timestamps: true },
);

export default todoSchema;
