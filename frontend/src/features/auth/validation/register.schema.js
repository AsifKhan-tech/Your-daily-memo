import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string().email().min(3).max(254).lowercase().required(),

  password: Joi.string()
    .min(8)
    .max(128)
    .message("Password must contain 8 chars minimum")
    .required(),

  role: Joi.string().valid("student", "teacher", "user").default("user"),
});

export default registerSchema;
