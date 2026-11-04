import Joi from "joi";

import Basedto from "../../../common/dto/base.dto.js";

class BulkDeleteTodosDTO extends Basedto {
  static schema = Joi.object({
    todoIds: Joi.array().items(Joi.string().hex().length(24)).min(1).unique().required(),
  });
}

export default BulkDeleteTodosDTO;
