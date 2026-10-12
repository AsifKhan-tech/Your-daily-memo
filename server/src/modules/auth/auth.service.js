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

  //? Give token bcz user is registering, hashedToken will keep in DB

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.create({
    name: name,
    email: email,
    password: password,
    role: role,
    verificationToken: hashedToken,
  });

  console.log("Stored user: ", user);

  // TODO: send an email to the user with a token: rawToken

  //? When you need not return some fields
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.verificationToken;

  return userObject;
};

const login = async ({ email, password }) => {
  // take email and find user in DB
  // check if password is correct
  //check if verified or not

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid Email or password");

  //somehow I will check password

  if (!user.isVerified) {
    throw ApiError.forbidden("Please verify your email before login");
  }

  //send tokens to the client
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ _id: user._id });

  //store hashed refreshToken of the specific user in DB
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false }); //don't run DB validation

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshToken;

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
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

export { register, login, refresh, logout };
