import express from "express";
import { getUsers ,updateUser , deleteUser } from "./admin.controller.js";
import validate from "../../middleware/validate.js";
import {updateUserSchema} from "./admin.validation.js"
const router = express.Router();

router.get("/", getUsers);
router.patch("/update/:id",validate(updateUserSchema), updateUser);
router.delete("/delete/:id", deleteUser);

export const adminRoutes = router;  
