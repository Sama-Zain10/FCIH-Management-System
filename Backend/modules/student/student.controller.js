import UserModel from "../../model/user.js";
import GradeModel from "../../model/grade.js";
import EnrollmentModel from "../../model/enrollment.js";
import CourseModel from "../../model/course.js";

import {
  NotFoundException,
  ConflictException
} from "../../middleware/errorHandler.js";

import asyncHandler from "../../middleware/asyncHandler.js";


// ======================== Get Profile ========================

export const getProfile = asyncHandler(async (req, res) => {

  const user = await UserModel.findById(req.user.id)
    .select("-password");

  if (!user) {
    NotFoundException("User not found");
  }

  res.status(200).json(user);

});


// ======================== Update Profile ========================

export const updateProfile = asyncHandler(async (req, res) => {


  const { name, email, department } = req.body;

const user = await UserModel.findByIdAndUpdate(
  req.user.id,
  {
    name,
    email,
    department
  },
  {
    new: true,
    runValidators: true
  }
).select("-password");
  if (!user) {
    NotFoundException("User not found");
  }

  res.status(200).json(user);

});


// ======================== Get My Grades ========================
export const getMyGrades = asyncHandler(async (req, res) => {

  const enrollments = await EnrollmentModel.find({
    studentId: req.user.id
  }).populate(
  "courseId",
  "name code instructor credits"
);

  const result = await Promise.all(

    enrollments.map(async (enrollment) => {

      const grade = await GradeModel.findOne({
        studentId: req.user.id,
        courseId: enrollment.courseId._id
      });

      return {
        courseId: enrollment.courseId,
        score: grade?.score || null,
        letter: grade?.letter || null,
        semester: grade?.semester || null
      };

    })

  );

  res.status(200).json(result);

});

// ======================== Enroll ========================

export const enrollInCourse = asyncHandler(async (req, res) => {

  const { courseId } = req.params;

  const course = await CourseModel.findById(courseId);

  if (!course) {
    NotFoundException("Course not found");
  }

  try {

    const enrollment = await EnrollmentModel.create({
      studentId: req.user.id,
      courseId
    });

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment
    });

  } catch (err) {

    if (err.code === 11000) {
      ConflictException("Already enrolled in this course");
    }

    throw err;

  }

});


// ======================== Unenroll ========================

export const unenrollFromCourse = asyncHandler(async (req, res) => {

  const { courseId } = req.params;

  const enrollment = await EnrollmentModel.findOneAndDelete({

    studentId: req.user.id,
    courseId

  });

  if (!enrollment) {

    NotFoundException("Enrollment not found");

  }

  res.status(200).json({

    message: "Unenrolled successfully"

  });

});


// ======================== Get My Courses ========================

export const getMyCourses = asyncHandler(async (req, res) => {

  const enrollments = await EnrollmentModel.find({

    studentId: req.user.id

  }).populate("courseId");

  const courses = enrollments.map((e) => e.courseId);

  res.status(200).json(courses);

});