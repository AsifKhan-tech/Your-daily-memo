import Joi from "joi";

import Basedto from "../../../common/dto/base.dto.js";

class Registerdto extends Basedto {
  static schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().min(3).max(254).lowercase().required(),
    password: Joi.string()
      .min(8)
      .max(128)
      .message("Password must contain 8 chars minimum")
      .min(8)
      .required(),
    role: Joi.string().valid("student", "teacher", "user").default("user"),
  });
}
export default Registerdto;
