import Joi from "joi";

const updateTodoSchema = Joi.object({
  todo: Joi.string().trim().min(1).max(200).messages({
    "string.empty": "Todo is required.",
    "string.min": "Todo must contain at least 1 character.",
    "string.max": "Todo cannot exceed 200 characters.",
  }),
  dateTime: Joi.date().iso().messages({
    "date.base": "Enter a valid date and time.",
    "date.format": "Enter a valid date and time.",
  }),
  completed: Joi.boolean(),
})
  .min(1)
  .messages({
    "object.min": "Provide at least one field to update.",
  });

export default updateTodoSchema;
