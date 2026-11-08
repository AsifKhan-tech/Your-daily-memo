import Joi from "joi";

const createTodoSchema = Joi.object({
  todo: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Todo is required.",
    "string.min": "Todo must contain at least 1 character.",
    "string.max": "Todo cannot exceed 200 characters.",
    "any.required": "Todo is required.",
  }),
  dateTime: Joi.date().iso().required().messages({
    "date.base": "Enter a valid date and time.",
    "date.format": "Enter a valid date and time.",
    "any.required": "Date and time are required.",
  }),
});

export default createTodoSchema;
