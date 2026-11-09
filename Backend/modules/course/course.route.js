import express from "express";
import isAuth from "../../middleware/isAuth.js"
import isAdmin from "../../middleware/isAdmin.js"
import validate from "../../middleware/validate.js";
import {createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse,} from "./course.controller.js"
import { createCourseSchema, updateCourseSchema } from "./course.validation.js";

const router = express.Router();
router.get("/",isAuth,getAllCourses)
router.get("/:id",isAuth,getCourseById)

router.post("/add-course",isAuth,isAdmin, validate(createCourseSchema),createCourse)
router.patch("/:id",isAuth,isAdmin, validate(updateCourseSchema),updateCourse)
router.delete("/:id",isAuth,isAdmin,deleteCourse)


export const courseRoutes = router;  