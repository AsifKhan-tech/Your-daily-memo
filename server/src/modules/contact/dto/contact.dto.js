import Joi from "joi";

import Basedto from "../../../common/dto/base.dto.js";

class ContactDTO extends Basedto {
  static schema = Joi.object({
    email: Joi.string().trim().email().lowercase().max(254).required(),
    description: Joi.string().trim().min(2).max(500).required(),
  });
}

export default ContactDTO;