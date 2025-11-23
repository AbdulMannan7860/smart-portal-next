import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
});

// Prevent model overwrite error in Next.js
const Course =
  mongoose.models.Courses || mongoose.model("Courses", courseSchema);

export default Course;
