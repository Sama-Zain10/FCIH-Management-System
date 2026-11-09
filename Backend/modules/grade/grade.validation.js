import Joi from "joi";

export const createGradeSchema = Joi.object({

  studentId: Joi.string()
    .required(),

  courseId: Joi.string()
    .required(),

  score: Joi.number()
    .min(0)
    .max(100),

  letter: Joi.string()
    .valid("A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"),

  semester: Joi.string(),

  status: Joi.string()
    .valid("In Progress", "Completed", "Failed")

});

export const updateGradeSchema = Joi.object({
  score: Joi.number().min(0).max(100),
  letter: Joi.string().valid("A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"),
  semester: Joi.string(),
  status: Joi.string().valid("In Progress", "Completed", "Failed")
}).min(1);