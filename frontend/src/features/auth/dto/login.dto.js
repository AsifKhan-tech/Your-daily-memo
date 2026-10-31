import loginSchema from "../validation/login.schema.js";

export function validateLoginDto(payload) {
  const { error, value } = loginSchema.validate(payload, {
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
