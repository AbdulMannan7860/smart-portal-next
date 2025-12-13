import { NextResponse } from "next/server";
import Attendance from "../../../lib/models/Attendance.model.js";
import Course from "../../../lib/models/Course.model.js";
import Schedule from "../../../lib/models/Schedule.model.js";
import User from "../../../lib/models/User.model.js";
import connectToMongoDB from "../../../lib/db.js";
import fetchUser from "../../middleware/fetchUser";;

const MASTER_DB_API_URL = process.env.MASTER_DB_API_URL || "";

export async function POST(request) {
  try {
    await connectToMongoDB();

    // Authenticate teacher
    const authResult = await fetchUser(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const user = authResult.user;
    const validateUser = await User.findById(user._id);
    if (!validateUser || validateUser.role !== "Teacher") {
      return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
    }

    // Bulk attendance payload
    const { courseId, program, semester, attendance } = await request.json();
    if (!courseId || !attendance || !Array.isArray(attendance)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const course = await Course.findOne({ courseCode: courseId });
    if (!course) {
      return NextResponse.json({ error: "Course Not Found" }, { status: 400 });
    }

    const date = new Date();
    const dateOnly = new Date(date.toISOString().split("T")[0]); // zeroed time
    const getDay = date.getDay();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const saved = [];
    const skipped = [];

    for (const att of attendance) {
      const { studentId, status } = att;

      // Fetch student from MASTER DB
      let masterStudent;
      try {
        const res = await fetch(`${MASTER_DB_API_URL}/students/${studentId}`);
        const data = await res.json();
        if (!data || data.error) {
          skipped.push({ studentId, reason: "Student Not Found in Master DB" });
          continue;
        }
        masterStudent = data;
      } catch (err) {
        skipped.push({ studentId, reason: "Master DB fetch error" });
        continue;
      }

      const sessionFind = masterStudent.Reg_no.slice(4, 5) === 'M' ? 'Morning' : 'Evening';

      // Validate schedule
      const schedule = await Schedule.findOne({
        courseCode: courseId,
        session: sessionFind
      });

      if (!schedule) {
        skipped.push({ studentId, reason: "Schedule Not Found" });
        continue;
      }

      if (days[getDay] !== schedule.day) {
        skipped.push({ studentId, reason: `Attendance only allowed on ${schedule.day}` });
        continue;
      }

      // Duplicate check
      const existing = await Attendance.findOne({
        courseId,
        studentId,
        program,
        semester,
        date: { $gte: dateOnly, $lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000) }
      });
      if (existing) {
        skipped.push({ studentId, reason: "Already Added" });
        continue;
      }

      // Save attendance
      const newAttendance = new Attendance({
        courseId,
        studentId,
        status: status === "Present" ? "Present" : status === "Leave" ? "Leave" : "Absent",
        program,
        semester,
        date: dateOnly
      });

      await newAttendance.save();
      saved.push({ studentId, status });
    }

    return NextResponse.json({
      message: saved.length > 0 ? `Attendance submission complete ${saved.length} records added and ${skipped.length} skipped. Details included.` : "No attendance records were added.",
      success: true,
      saved,
      skipped
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
