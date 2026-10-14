import ApiError from "../../common/utils/api-error.js";
import User from "./auth.model.js";

const authenticate = async (req, res, next) => {
  // extract token from the request
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) ApiError.unauthorized("Not authenticated");

  //verify the access token and search the specific user
  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded._id);
  if (!user) ApiError.unauthorized("User no longer exists");

  // Add user in the request object
  req.user = {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        "You don't have permission to perform this action",
      );
    }
    next();
  };
};

export { authenticate, authorize };
