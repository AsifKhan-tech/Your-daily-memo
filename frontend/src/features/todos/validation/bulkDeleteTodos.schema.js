import Joi from "joi";

const bulkDeleteTodosSchema = Joi.object({
  todoIds: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .unique()
    .required()
    .messages({
      "array.base": "Todo IDs must be an array.",
      "array.min": "Select at least one todo.",
      "array.unique": "Todo IDs must be unique.",
      "string.hex": "Todo ID must be a valid object ID.",
      "string.length": "Todo ID must be a valid object ID.",
      "any.required": "Todo IDs are required.",
    }),
});

export default bulkDeleteTodosSchema;
