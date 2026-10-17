import crypto from "node:crypto";

import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/tokens.js";
import User from "./auth.model.js";
import { sendVerificationEmail } from "../../common/config/email.js";
// It's the model(schema)

//utiliy to hash the data
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

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
    console.error(error);
  }

  // When you need not return some fields
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.verificationToken;

  console.log("User registered");
  return userObject;
};

const login = async ({ email, password }) => {
  // take email and find user in DB
  // check if password is correct
  //check if verified or not

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid Email or password");

  //check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw ApiError.unauthorized("Invalid Email or password");

  //if isVerified: false, email will not send
  if (!user.isVerified) {
    throw ApiError.forbidden("Please verify your email before login");
  }

  //generate tokens for sending to the client
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  //store hashed refreshToken of the specific user in DB
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false }); //don't run DB validation

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

const refresh = async (token) => {
  //check token is availabe
  if (!token) throw ApiError.unauthorized("Refresh token missing");

  //verify refresh token & it returns payload
  const decoded = verifyRefreshToken(token);

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
  const user = await User.findOneAndUpdate(
    { verificationToken: hashedToken },
    { $set: { isVerified: true }, $unset: { verificationToken: 1 } },
    { new: true }, //with this 'flag true' DB returns the updated object
  ).select("+verificationToken");

  //if user not found in DB
  if (!user) throw ApiError.badRequest("Invalid or expired token");

  //return the response
  return { message: "Email verified successfully", user };
};

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
};

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
};
