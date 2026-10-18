import Joi, { string } from "joi";

import Basedto from "../../../common/dto/base.dto.js";

class TodoDto extends Basedto {
  static schema = Joi.object({
    todoValue: string().trim().min(1).max(200).required,
  });
}

export default TodoDto;
