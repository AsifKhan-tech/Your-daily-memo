import Joi from "joi";

const contactSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().max(254).required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "string.max": "Email cannot exceed 254 characters.",
    "any.required": "Email is required.",
  }),
  description: Joi.string().trim().min(2).max(500).required().messages({
    "string.empty": "Message is required.",
    "string.min": "Message must be at least 2 characters.",
    "string.max": "Message cannot exceed 500 characters.",
    "any.required": "Message is required.",
  }),
});

export default contactSchema;
