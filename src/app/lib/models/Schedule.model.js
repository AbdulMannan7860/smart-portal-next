import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  program_title: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  teacherCode: {
    type: String,
    required: true,
  },
  class_start_time: {
    type: String,
    enum: ["09:00:00", "11:00:00", "18:00:00", "20:00:00"],
    required: true,
  },
  class_end_time: {
    type: String,
    enum: ["11:00:00", "13:00:00", "20:00:00", "22:00:00"],
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  session: {
    type: String,
    enum: ["Morning", "Evening"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Completed", "Cancelled", "Pending"],
    required: true,
  },
});

// Prevent model overwrite error in Next.js
const Schedule =
  mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);

export default Schedule;
