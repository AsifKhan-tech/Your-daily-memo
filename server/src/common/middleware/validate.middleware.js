import ApiError from "../utils/api-error.js";

const validateMiddlewareFunction = (Dtoclass) => {
  return (req, res, next) => {
    // this returned function is actual middleware function
    const { errors, value } = Dtoclass.validateInput(req.body);

    if (errors) {
      throw ApiError.badRequest(errors.join("; "));
    }
    req.body = value;
    next();
  };
};

export default validateMiddlewareFunction;
