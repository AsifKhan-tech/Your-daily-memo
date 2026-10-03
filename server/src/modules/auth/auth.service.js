import ApiError from "../../common/utils/api-error.js";
import { generateResetToken } from "../../common/utils/tokens.js";
import User from "./auth.model.js";
// It's the model

const register = async ({ name, email, password, role = "user" }) => {
  // check in DB if user already exists or not

  const existingUser = await User.findOne({ email });
  if (existingUser) throw ApiError.conflict("email already exists");

  //? Give token bcz user is registering, hashedToken will keep in DB

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.create({
    name,
    email,
    password,
    role,
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

export { register };
