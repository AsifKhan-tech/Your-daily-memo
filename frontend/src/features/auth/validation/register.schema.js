import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name cannot exceed 50 characters.",
    "any.required": "Name is required.",
  }),

  email: Joi.string().email().min(3).max(254).lowercase().required().messages({
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

  role: Joi.string()
    .valid("student", "teacher", "user")
    .default("user")
    .messages({
      "any.only": "Please select a valid role.",
    }),
});

export default registerSchema;
