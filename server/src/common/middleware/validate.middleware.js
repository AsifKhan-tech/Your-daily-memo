import ApiError from "../utils/api-error.js";

const validateMiddleware = (Dtoclass) => {
  return (req, res, next) => {
    const { error, value } = Dtoclass.validateInout(req.body);

    if (error) {
      throw ApiError.badRequest(error.join("; "));
    }
    req.body = value;
    next();
  };
};

export default validateMiddleware;
