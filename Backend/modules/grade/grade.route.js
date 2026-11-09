import express from "express";
import isAuth from "../../middleware/isAuth.js";
import isAdmin from "../../middleware/isAdmin.js";
import {
    createGrade,
    getGrades,
    updateGrade,
    deleteGrade,
} from "./grade.controller.js";
import validate from "../../middleware/validate.js";
import { createGradeSchema, updateGradeSchema } from "./grade.validation.js";

const router = express.Router();

router.post("/",     isAuth, isAdmin, validate(createGradeSchema), createGrade);
router.get("/",      isAuth, isAdmin, getGrades);
router.put("/:id",   isAuth, isAdmin, validate(updateGradeSchema), updateGrade);
router.delete("/:id",isAuth, isAdmin, deleteGrade);

export const gradeRoutes = router;