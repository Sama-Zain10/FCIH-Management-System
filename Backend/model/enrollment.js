import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
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
    }
    },
    { timestamps: true }
);

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const EnrollmentModel = mongoose.model("Enrollment", enrollmentSchema);

export default EnrollmentModel;