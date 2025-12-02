import { NextResponse } from "next/server";
import Attendance from "@/app/lib/models/Attendance.model.js";
import Student from "@/app/lib/models/Student.model.js";
import Course from "@/app/lib/models/Course.model.js";
import Schedule from "@/app/lib/models/Schedule.model.js";
import User from "@/app/lib/models/User.model.js";
import connectToMongoDB from "@/app/lib/db.js";
import fetchUser from "@/app/api/middleware/fetchUser";

export async function POST(request) {
  try {
    await connectToMongoDB();

    const authResult = await fetchUser(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user;

    const validateUser = await User.findById(user._id);

    if (!validateUser || validateUser.role !== "Teacher") {
      return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
    }

    const { courseId, studentId, status } = await request.json();

    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json({ error: "Course Not Found" }, { status: 400 });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return NextResponse.json({ error: "Student Not Found" }, { status: 400 });
    }

    const date = new Date();

    const getDay = date.getDay();

    const schedule = await Schedule.findOne({
      courseCode: course?.courseCode,
      session: student.session,
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule Not Found" },
        { status: 400 }
      );
    }

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const checkDayMatch = days[getDay] === schedule.day;

    if (!checkDayMatch) {
      const message = `Attendance can only be added on ${schedule.day}`;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const findAttendance = await Attendance.findOne({
      courseId,
      studentId,
      date: date.toDateString(),
    });

    if (findAttendance) {
      return NextResponse.json(
        { error: "Attendance Already Added" },
        { status: 400 }
      );
    }

    const attendance = new Attendance({
      courseId,
      studentId,
      date: date.toDateString(),
      status,
    });

    await attendance.save();

    return NextResponse.json(
      { message: "Attendance Added Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
