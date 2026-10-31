import crypto from "node:crypto";

import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/tokens.js";
import User from "./auth.model.js";
// It's the model(schema)
import { sendResetPasswordEmail, sendVerificationEmail } from "../../common/utils/email.js";

//utiliy to hash the data
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// User registration service
const register = async ({ name, email, password, role = "user" }) => {
  // check in DB if user already exists or not
  const existingUser = await User.findOne({ email });
  if (existingUser) throw ApiError.conflict("email already exists");

  // create tokens for user and server
  const { rawToken, hashedToken } = generateResetToken();

  // store user in DB with hashedToken to check if(rawToken === hashedToken) for email verification
  const user = await User.create({
    name: name,
    email: email,
    password: password,
    role: role,
    verificationToken: hashedToken,
  });
  console.log("Stored user: ", user);

  // send an email to the user with a token: rawToken for varify the email
  try {
    await sendVerificationEmail(email, rawToken);
  } catch (error) {
    //catch error that was thrown when email couldn't send
    console.error("Register user:", error);
    /**
     * If the email failed to reach to the user,
     * delete the user from DB and give message
     */
    await User.findByIdAndDelete(user._id);
    throw ApiError.internal("Failed to send the verification email. Please try again!");
  }

  // When you need not return some fields
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.verificationToken;

  console.log("User registered");
  return userObject;
};

// Email verification service
const verifyEmail = async (token) => {
  // token should be a string & not empty after trimming
  if (typeof token !== "string" || !token.trim()) {
    throw ApiError.badRequest("Invalid token");
  }

  //hash the user token to compare with stored hashed token
  const hashedToken = hashToken(token.trim());

  /**
   * find the user in DB with this hashed token and compare it too with stored hashed token
   * update field 'isVerified: true' and remove verification token
   */

  /**
   * Find the user by their hashed verification token and mark them as verified.
   *
   * ARCHITECTURE NOTE (Mongoose 8/9+ standard):
   * We use `{ returnDocument: "after" }` instead of the legacy `{ new: true }` option.
   * This explicitly tells the MongoDB driver to return the newly updated user document
   * rather than the original unverified one.
   */
  const user = await User.findOneAndUpdate(
    { verificationToken: hashedToken },
    { $set: { isVerified: true }, $unset: { verificationToken: 1 } },
    { returnDocument: "after" }, //with this 'flag after' DB returns the updated object
  );

  //if user not found in DB
  if (!user) throw ApiError.badRequest("Invalid or expired token");

  //return the response
  return { message: "Email verified successfully", user };
};

// Re-send email verification service
/**
 * When email couldn't reach to the user to verify it's email,
 * It can resend the verification email
 */
const resendVerificationEmail = async (email) => {
  //find the user with specific email
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("Account not found");

  //if user already verified, give the error
  if (user.isVerified) throw ApiError.badRequest("Your email is already verified. Please login.");

  //generate reset tokens one give to the user
  //and another one store in DB to compare the user's token
  const { rawToken, hashedToken } = generateResetToken();

  //store hashedToken in DB
  user.verificationToken = hashedToken;
  await user.save({ validateBeforeSave: false });

  //resend the verification email
  try {
    await sendVerificationEmail(email, rawToken);
  } catch (error) {
    console.error("Resend verification: ", error);
    throw ApiError.internal("Failed to send the verification email. Please try again!");
  }
};

//User login service
const login = async ({ email, password }) => {
  // take email and find user in DB
  // check if password is correct
  //check if verified or not

  const user = await User.findOne({ email }).select("+password");
  console.log("User found:", Boolean(user));
  if (!user) throw ApiError.unauthorized("Invalid Email or password");

  //check password
  const isMatch = await user.comparePassword(password);
  console.log("Password valid:", isMatch);
  console.log("Email verified:", user.isVerified);
  if (!isMatch) throw ApiError.unauthorized("Invalid Email or password");

  //if isVerified: false, It means user didn't verify its email
  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before login", "EMAIL_NOT_VERIFIED");
  }

  //generate tokens for sending to the client so that client and server communicates smoothly
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  //store hashed refreshToken of the specific user in DB
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false }); //don't run DB validation

  const userObj = user.toObject();

  delete userObj.password;
  // Delete the refresh token that is save in DB
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

// Token refresh service
const refresh = async (token) => {
  //checking if the user has provided token
  if (typeof token !== "string" || !token.trim()) {
    throw ApiError.unauthorized("Refresh token missing");
  }

  //verify refresh token & it returns payload
  const decoded = verifyRefreshToken(token.trim());

  //find the specific user
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) throw ApiError.unauthorized("User not found");

  //check with stored hashed DB token
  if (user.refreshToken !== hashToken(token)) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  //generate access and refresh tokens
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user._id });

  //store hashed refreshToken of the specific user in DB
  user.refreshToken = hashToken(newRefreshToken);
  await user.save({ validateBeforeSave: false }); //don't run DB validation

  //removing some fields and return
  const userObj = user.toObject();
  delete userObj.refreshToken;

  return {
    user: userObj,
    accessToken,
    refreshToken: newRefreshToken,
  };
};

// User logout service
const logout = async (userId) => {
  /*
  //find user
  const user = await User.findById(userId);
  if (!user) throw ApiError.unauthorized("User not found");

  //delete refresh token
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });
  */

  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

// forgot password service
const forgotPassword = async (email) => {
  /**
   * find specific user with the email
   * check in DB for the given email
   * verify the email existance in DB
   */
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("No account found with this email");

  /**
   * create tokens
   * save resetPasswordToken it will hashedToken in DB
   * set resetPasswordToken expiry
   * save the user
   */

  const { rawToken, hashedToken } = generateResetToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  /**
   * send the email with the rawToken
   */

  try {
    await sendResetPasswordEmail(email, rawToken);
  } catch (error) {
    console.error("forgot password: ", error);
    throw ApiError.internal("Failed to send reset password email");
  }
};

// Reset password service
const resetPassword = async (token, newPassword) => {
  //checking if the user has provided token
  if (typeof token !== "string" || !token.trim()) {
    throw ApiError.badRequest("Invalid token");
  }

  //hash the user's token
  const hashedToken = hashToken(token.trim());

  //find the specific user with the help of token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() }, //checks token's expiration time > now
  });
  if (!user) throw ApiError.badRequest("Invalid reset token");

  //save password to the user "pre" hook will hash it
  user.password = newPassword;

  // terminate the seesion on password reset
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  user.refreshToken = null;
  await user.save();
};

// User profile service
const profile = async (userId) => {
  //find the specific user with the user's id and return
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

export {
  register,
  verifyEmail,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  profile,
  resendVerificationEmail,
};
