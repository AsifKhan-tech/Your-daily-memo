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

  // TODO: send an email to the user with a token: rawToken for varify the email

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

  //somehow I will check password

  //if isVerified: false, email will not send
  if (!user.isVerified) {
    throw ApiError.forbidden("Please verify your email before login");
  }

  //generate tokens for sending to the client
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ _id: user._id });

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
  const user = await User.findById(decoded._id).select("+refreshToken");
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

  // clean the token
  const trimToken = token.trim();

  //hash the user token to compare with stored hashed token
  const hashedToken = hashToken(trimToken);

  //find the user in DB with this token and compare too with stored hashed token
  const user = await User.findOne({ verificationToken: hashedToken });

  //if user not found in DB
  if (!user) throw ApiError.badRequest("Invalid or expired token");

  //update isVerified field and remove verification token
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: { isVerified: true },
      $unset: { verificationToken },
    },
    {
      new: true, //returns the updated object
    },
  );

  return { message: "Email verified successfully", user: updatedUser };
};

const forgotPassword = async (email) => {
  //find specific user with the email
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("No account found with this email");
};
export { register, login, refresh, logout, forgotPassword, verifyEmail };
