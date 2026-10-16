import ApiError from "../../common/utils/api-error.js";
import User from "./auth.model.js";
import { verifyAccessToken } from "../../common/utils/tokens.js";

// authenticate the user
const authenticate = async (req, res, next) => {
  // extract token from cookies OR request headers
  let token = req.cookies?.accessToken;
  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) throw ApiError.unauthorized("Not authenticated");

  //verify the access token and search the specific user
  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.unauthorized("User no longer exists");

  // Add user in the request object so that controller use this user without DB query
  req.user = {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  next();
};

// authorize the user
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
