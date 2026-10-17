import Joi from "joi";

import Basedto from "../../../common/dto/base.dto.js";

class ResetPasswordDto extends Basedto {
  static schema = Joi.object({
    password: Joi.string()
      .min(8)
      .max(128)
      .message("Password must contain 8 chars minimum")
      .required(),
  });
}
export default ResetPasswordDto;
