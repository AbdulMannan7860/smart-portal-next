import mongoose from "mongoose";

const courseOutlineSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true },
    courseName: { type: String, required: true },
    credits: { type: Number, required: true },
    program_title: { type: String, required: true },
    session: { type: String, required: true },
    semester: { type: String, required: true },
    teacherName: { type: String, required: true },
    teacherCode: { type: String, required: true },
    fileUrl: { type: String, required: true },
    expireAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Virtual field for status (Active / Expired)
courseOutlineSchema.virtual("status").get(function () {
  return new Date() > this.expireAt ? "Expired" : "Active";
});

// Unique index to prevent duplicate uploads for same course+semester+teacher
courseOutlineSchema.index(
  { courseCode: 1, semester: 1, teacherCode: 1 },
  { unique: true }
);

const CourseOutline =
  mongoose.models.CourseOutline ||
  mongoose.model("CourseOutline", courseOutlineSchema);

export default CourseOutline;
