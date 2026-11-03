import Joi from "joi";
import Basedto from "../../../common/dto/base.dto.js";

class UpdateTodoDto extends Basedto {
  static schema = Joi.object({
    memo: Joi.string().trim().min(1).max(200),
    dateTime: Joi.date().iso(),
    completed: Joi.boolean(),
  }).min(1);
}
export default UpdateTodoDto;
