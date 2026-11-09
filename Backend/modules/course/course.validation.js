import Joi from "joi";

export const createCourseSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().allow(""),
  instructor: Joi.string().required(),
  credits: Joi.number().min(1).max(6).required(),
  capacity: Joi.number().min(1).optional()
});

export const updateCourseSchema = Joi.object({
  name: Joi.string(),
  code: Joi.string(),
  description: Joi.string().allow(""),
  instructor: Joi.string(),
  credits: Joi.number().min(1).max(6),
  capacity: Joi.number().min(1)
}).min(1);