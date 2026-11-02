import Joi from "joi";

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .min(3)
    .max(254)
    .lowercase()
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please enter a valid email address.",
      "string.min": "Email must be at least 3 characters.",
      "string.max": "Email cannot exceed 254 characters.",
      "any.required": "Email is required.",
    }),
});

export default forgotPasswordSchema;
