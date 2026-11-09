import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
{
    name: {
    type: String,
    required: true,
    trim: true
    },
    code: {
    type: String,
    required: true,
    unique: true
    },
    description: {
    type: String,
    trim: true
    },
    instructor: {
    type: String,
    required: true
    },
    credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6
    },
    capacity: {
  type: Number,
  default: 30
}
},
{ timestamps: true }
);

const CourseModel = mongoose.model("Course", courseSchema);

export default CourseModel;