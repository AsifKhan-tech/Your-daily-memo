import ApiError from "../utils/api-error.js";

const validateMiddlewareFunction = (Dtoclass) => {
  // the returned function is actual middleware function
  //This function executes when request come
  //This is also synchronous middleware
  return (req, res, next) => {
    const { errors, value } = Dtoclass.validateInput(req.body);

    if (errors) {
      throw ApiError.badRequest(errors.join("; "));
    }
    req.body = value;
    next();
  };
};

export default validateMiddlewareFunction;

/**
 * next(): function give signal to the express that the middleware has been completed
 */
