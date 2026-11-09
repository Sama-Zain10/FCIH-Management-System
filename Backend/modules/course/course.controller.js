import CourseModel from "../../model/course.js";
import { NotFoundException } from "../../middleware/errorHandler.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import EnrollmentModel from "../../model/enrollment.js";
// ====================== Get All Courses ======================

export const getAllCourses = asyncHandler(async (req, res) => {

  const courses = await CourseModel.find();

  const result = await Promise.all(
    courses.map(async (course) => {

      const enrolledCount = await EnrollmentModel.countDocuments({
        courseId: course._id
      });

      return {
        ...course.toObject(),
        enrolledCount
      };

    })
  );

  res.status(200).json(result);

});
// ====================== Get Course By Id ======================

export const getCourseById = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const course = await CourseModel.findById(id);

  if (!course) {
    NotFoundException("Course not found");
  }

  res.status(200).json(course);

});

// ====================== Create Course ======================

export const createCourse = asyncHandler(async (req, res) => {

  const course = await CourseModel.create(req.body);

  res.status(201).json({
    message: "Course created successfully",
    course
  });

});

// ====================== Update Course ======================

export const updateCourse = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const course = await CourseModel.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!course) {
    NotFoundException("Course not found");
  }

  res.status(200).json({
    message: "Course updated successfully",
    course
  });

});

// ====================== Delete Course ======================

export const deleteCourse = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const course = await CourseModel.findByIdAndDelete(id);

  if (!course) {
    NotFoundException("Course not found");
  }

  res.status(200).json({
    message: "Course deleted successfully"
  });

});