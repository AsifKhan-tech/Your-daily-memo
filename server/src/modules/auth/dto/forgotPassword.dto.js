import Joi from "joi";

import Basedto from "../../../common/dto/base.dto.js";

class ForgotPasswordDto extends Basedto {
  static schema = Joi.object({
    email: Joi.string().email().min(3).max(254).lowercase().required(),
  });
}
export default ForgotPasswordDto;
