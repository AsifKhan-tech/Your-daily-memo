import Joi from "joi";

class BaseDTO {
  static schema = Joi.object({});

  static validateInput(data) {
    const { error, value } = this.schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      console.log(error);
      const errors = error.details.map((detail) => detail.message);
      return { errors, value: null };
    }
    return { error: null, value };
  }
}

export default BaseDTO;
