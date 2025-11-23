import { NextResponse } from "next/server";
import Schedule from "../../../lib/models/Schedule.model.js";
import Course from "../../../lib/models/Course.model.js";
import connectToMongoDB from "../../../lib/db.js";
import fetchUser from "../../middleware/fetchUser.js";
import Teacher from "@/app/lib/models/Teacher.model.js";

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

    const checkUser = authResult.user;

    if (checkUser.role !== "Management") {
      return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
    }

    const {
      courseCode,
      class_end_time,
      class_start_time,
      day,
      room,
      program_title,
      semester,
      teacherID,
      status,
    } = await request.json();

    const course = await Course.findOne({ courseCode });
    const teacher = await Teacher.findOne({ teacherID });

    if (!course) {
      return NextResponse.json({ error: "Course Not Found" }, { status: 400 });
    }

    if (!teacher) {
      return NextResponse.json({ error: "Teacher Not Found" }, { status: 400 });
    }

    const session =
      class_start_time === "09:00:00" || class_start_time === "11:00:00"
        ? "Morning"
        : "Evening";

    const findSchedule = await Schedule.findOne({
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: course.credits,
      class_start_time,
      class_end_time,
      day,
      room,
      session,
      program_title,
      semester,
      teacherName: teacher.fullName,
      teacherCode: teacher.teacherID,
      status,
    });

    if (findSchedule) {
      return NextResponse.json(
        { error: "Schedule Already Exists" },
        { status: 400 }
      );
    }

    if (!room) {
      return NextResponse.json({ error: "Room Not Found" }, { status: 400 });
    }

    const roomAvailable = await Schedule.find({
      class_start_time,
      class_end_time,
      day,
      room,
      courseCode: { $ne: courseCode },
    });

    if (roomAvailable.length > 0) {
      return NextResponse.json(
        { error: "Room Already Booked" },
        { status: 400 }
      );
    }

    const newSchedule = new Schedule({
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: course.credits,
      room,
      class_start_time,
      class_end_time,
      day,
      session,
      program_title,
      semester,
      teacherName: teacher.fullName,
      teacherCode: teacher.teacherID,
      status,
    });

    await newSchedule.save();

    return NextResponse.json(newSchedule, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
