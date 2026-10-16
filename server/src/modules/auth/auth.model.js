import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, //remove the spaces
      minlength: 2,
      maxlength: 50,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,

      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "user"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      select: false, //when an object(user) created using it, all the data is returned except the data which => selcet:false
    },

    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },
  },
  { timestamps: true },
);

// securly hash the user's password before storing it.
userSchema.pre("save", async function (next) {
  /**
   * If the password field is unchanged, skip hashing and proceed to the next middleware.
   */
  if (!this.isModified("password")) return next();

  /**
   * Hash the newly updated password with 12 salt rounds before saving to the DB.
   */
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Create an instance method to securely compare a given plain-text password
 * with the user's stored hashed password in the database.
 *
 * Returns true if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (userPassword) {
  // compare user password and store hash password
  return bcrypt.compare(userPassword, this.password);
};
export default mongoose.model("User", userSchema);
