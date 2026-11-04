import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    todo: {
      type: String,
      trim: true,
      required: [true, "Todo is required"],
      minlength: 1,
      maxlength: 200,
    },
    dateTime: {
      type: Date,
      required: [true, "Date and time are required"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Most requests load a user's memos in creation order.
// 1 Ascending order
todoSchema.index({ user: 1, createdAt: 1 });

export default mongoose.model("Todo", todoSchema);
