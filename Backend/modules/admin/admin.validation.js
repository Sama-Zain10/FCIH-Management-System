import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(20),

  email: Joi.string().email(),

  age: Joi.number().min(5).max(60),

  gender: Joi.string().valid("male", "female"),

  role: Joi.string().valid("admin", "student"),

  studentId: Joi.string().allow("", null),

  department: Joi.string().allow("", null)

}).min(1);