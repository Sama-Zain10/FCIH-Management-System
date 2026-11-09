import express from "express";
import isAuth from "../../middleware/isAuth.js";
import {
    getProfile,
    updateProfile,
    getMyGrades,
    enrollInCourse,
    unenrollFromCourse,
    getMyCourses,
} from "./student.controller.js";
import { updateProfileSchema } from "./student.validation.js";
import validate from "../../middleware/validate.js";

const router = express.Router();

router.get("/profile", isAuth, getProfile);
router.put("/profile", isAuth, validate(updateProfileSchema), updateProfile);
router.get("/grades", isAuth, getMyGrades);

router.get("/courses", isAuth, getMyCourses);
router.post("/courses/:courseId/enroll", isAuth, enrollInCourse);
router.delete("/courses/:courseId/unenroll", isAuth, unenrollFromCourse);

export { router as studentRoutes };