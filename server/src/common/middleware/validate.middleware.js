import ApiError from "../utils/api-error.js";

const validateMiddleware = (Dtoclass) => {
  return (req, res, next) => {
    const { errors, value } = Dtoclass.validateInout(req.body);

    if (errors) {
      throw ApiError.badRequest(errors.join("; "));
    }
    req.body = value;
    next();
  };
};

export default validateMiddleware;
