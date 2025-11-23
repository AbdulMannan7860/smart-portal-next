import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  teacherID: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  jobStatus: {
    type: String,
    enum: ["Visting", "Pemenant"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: true,
  },
});

// Prevent model overwrite error in Next.js
const Teacher =
  mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

export default Teacher;
