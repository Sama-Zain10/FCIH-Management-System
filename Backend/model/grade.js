import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    letter: {
      type: String,
      enum: ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"]
    },
    semester: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["In Progress", "Completed", "Failed"],
      default: "In Progress"
    }
  },
  { timestamps: true }
);

gradeSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const GradeModel = mongoose.model("Grade", gradeSchema);

export default GradeModel;