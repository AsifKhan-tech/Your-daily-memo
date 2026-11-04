import Joi from "joi";

import Basedto from "../../../common/dto/base.dto.js";

class UpdateTodoDTO extends Basedto {
  static schema = Joi.object({
    todo: Joi.string().trim().min(1).max(200),
    dateTime: Joi.date().iso(),
    completed: Joi.boolean(),
  }).min(1);
}

export default UpdateTodoDTO;

// min(1): Joi ensures that at least 1 key is present
