import Joi from "joi";

const loginSchema = Joi.object({
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

  password: Joi.string().min(8).max(128).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters.",
    "string.max": "Password cannot exceed 128 characters.",
    "any.required": "Password is required.",
  }),
});

export default loginSchema;
