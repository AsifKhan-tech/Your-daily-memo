import registerSchema from "../validation/register.schema.js";

export function validateRegisterDto(payload) {
  const { error, value } = registerSchema.validate(payload, {
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
