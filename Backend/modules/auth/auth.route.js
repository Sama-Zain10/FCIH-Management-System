import express from "express";
import { signup,login, verifyResetCode, resetPassword, forgotPassword} from "./auth.controller.js";
import validate from "../../middleware/validate.js";
import {signupSchema,loginSchema} from "./auth.validation.js"
const router = express.Router();
router.post("/signup",validate(signupSchema),signup)
router.post("/login",validate(loginSchema),login)
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export const authRoutes = router;  