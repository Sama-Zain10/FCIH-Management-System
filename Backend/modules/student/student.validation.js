import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().required(),

  email: Joi.string()
    .email()
    .required(),

  department: Joi.string().optional()
});