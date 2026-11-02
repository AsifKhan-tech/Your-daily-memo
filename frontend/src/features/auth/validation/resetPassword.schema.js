import Joi from "joi";

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).max(128).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters.",
    "string.max": "Password cannot exceed 128 characters.",
    "any.required": "Password is required.",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "Please confirm your password.",
    "any.only": "Passwords do not match.",
    "any.required": "Please confirm your password.",
  }),
});

export default resetPasswordSchema;
