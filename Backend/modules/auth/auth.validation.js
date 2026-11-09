import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().min(5).max(60).required(),
  gender: Joi.string().valid("male", "female").required(),
  role: Joi.string().valid("admin", "student").default("student"),
  studentId: Joi.when("role", {
    is: "student",
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  department: Joi.when("role", {
    is: "student",
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});