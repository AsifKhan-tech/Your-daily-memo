import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      required: [true, "Email is required"],
    },
    description: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 500,
      required: [true, "Description is required"],
    },
    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Contact", contactSchema);
