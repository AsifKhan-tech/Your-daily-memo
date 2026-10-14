import Joi from "joi";

import Basedto from "../../../common/dto/base.dto.js";

class LoginDto extends Basedto {
  static schema = Joi.object({
    email: Joi.string().email().min(3).max(254).lowercase().required(),
    password: Joi.string()
      .min(8)
      .max(128)
      .message("Password must contain 8 chars minimum")
      .required(),
  });
}
export default LoginDto;
