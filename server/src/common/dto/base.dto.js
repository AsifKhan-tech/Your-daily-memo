import Joi from "joi";

class Basedto {
  static schema = Joi.object({});

  static validateInput(data) {
    //this.schema: refers the schema that pass in data variable
    const { error, value } = this.schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      console.log(error);
      const errors = error.details.map((detail) => detail.message);
      return { errors, value: null };
    }
    return { errors: null, value };
  }
}

export default Basedto;
