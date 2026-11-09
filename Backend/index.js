import express from "express";
import mongoose from "mongoose";
import {adminRoutes,authRoutes, courseRoutes, gradeRoutes, studentRoutes} from "./modules/index.js";
import logger from "./middleware/logger.js";
import isAuth from "./middleware/isAuth.js";
import isAdmin from "./middleware/isAdmin.js";
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";

dotenv.config()
connectDB();
const app = express();

app.use(cors({
    origin:"*",
    methods:'GET,POST,DELETE,PUT,PATCH'
}));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
// app.use(isAuth);

app.use("/admin" ,isAuth, isAdmin, adminRoutes);
app.use("/auth", authRoutes);
app.use("/student",studentRoutes);
app.use("/course",courseRoutes);
app.use("/grade",gradeRoutes);

app.use(globalErrorHandler)

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});