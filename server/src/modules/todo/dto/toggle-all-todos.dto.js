import Joi from "joi";
import Basedto from "../../../common/dto/base.dto.js";

class ToggleAllTodosDto extends Basedto {
  static schema = Joi.object({
    completed: Joi.boolean().required(),
  });
}
export default ToggleAllTodosDto;
