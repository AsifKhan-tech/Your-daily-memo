import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from "../../common/utils/tokens.js";
import User from "./auth.model.js";
// It's the model

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
  if (!user) throw ApiError.unauthorized("Invalied Email or password");

  //somehow I will check password

  if (!user.isVerified) {
    throw ApiError.forbidden("Please verify your email before login");
  }

  //send tokens
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken(user._id);
};

export { register };
