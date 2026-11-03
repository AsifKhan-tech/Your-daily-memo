import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    todoValue: {
      type: String,
      trim: true,
      require: [true, "Todo is required"],
      minlength: 1,
      maxlength: 200,
    },

    dateTime: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Todo", todoSchema);
