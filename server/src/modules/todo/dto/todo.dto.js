import Joi from "joi";

import Basedto from "../../../common/dto/base.dto.js";

class TodoDto extends Basedto {
  static schema = Joi.object({
    memo: Joi.string().trim().min(1).max(200).required(),
    dateTime: Joi.date().iso().required(),
  });
}

export default TodoDto;
