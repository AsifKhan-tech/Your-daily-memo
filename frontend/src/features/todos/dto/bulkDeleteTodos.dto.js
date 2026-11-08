import bulkDeleteTodosSchema from "../validation/bulkDeleteTodos.schema.js";

export function validateBulkDeleteTodosDto(payload) {
  const { error, value } = bulkDeleteTodosSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = {};

    error.details.forEach((detail) => {
      const field = detail.path[0];

      if (field && !errors[field]) {
        errors[field] = detail.message;
      }
    });

    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    data: value,
    errors: {},
  };
}
