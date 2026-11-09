import GradeModel from "../../model/grade.js";
import EnrollmentModel from "../../model/enrollment.js";
import { NotFoundException, ConflictException } from "../../middleware/errorHandler.js";
import asyncHandler from "../../middleware/asyncHandler.js";

// ====================== Create Grade ======================
export const createGrade = asyncHandler(async (req, res) => {

  const { studentId, courseId, score, letter, semester, status } = req.body;

  const enrolled = await EnrollmentModel.findOne({ studentId, courseId });

  if (!enrolled) {
    return res.status(400).json({ message: "This student is not enrolled in this course" });
  }

  try {
    const grade = await GradeModel.create({ studentId, courseId, score, letter, semester, status });

    res.status(201).json({
      message: "Grade added successfully",
      grade
    });
  } catch (err) {
    if (err.code === 11000) {
      return ConflictException("Grade already exists for this student in this course");
    }
    throw err;
  }

});

// ====================== Get All Grades ======================
export const getGrades = asyncHandler(async (req, res) => {

  const grades = await GradeModel.find()
    .populate("studentId", "name email")
    .populate("courseId", "name code");

  const mapped = grades.map(g => ({
    _id: g._id,
    studentId: g.studentId?._id,
    courseId: g.courseId?._id,
    studentName: g.studentId?.name || "Unknown",
    studentEmail: g.studentId?.email || "",
    courseTitle: g.courseId?.name || "Unknown",
    courseCode: g.courseId?.code || "",
    grade: g.letter || "-",
    status: g.status
  }));

  res.status(200).json(mapped);

});

// ====================== Update Grade ======================
export const updateGrade = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { score, letter, semester, status } = req.body;

  const grade = await GradeModel.findByIdAndUpdate(
    id,
    { score, letter, semester, status },
    { new: true, runValidators: true }
  );

  if (!grade) {
    return NotFoundException("Grade not found");
  }

  res.status(200).json({
    message: "Grade updated successfully",
    grade
  });

});

// ====================== Delete Grade ======================
export const deleteGrade = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const grade = await GradeModel.findByIdAndDelete(id);

  if (!grade) {
    return NotFoundException("Grade not found");
  }

  res.status(200).json({ message: "Grade deleted successfully" });

});