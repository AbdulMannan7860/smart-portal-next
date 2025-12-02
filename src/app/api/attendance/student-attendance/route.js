import { NextResponse } from "next/server";
import Attendance from "@/app/lib/models/Attendance.model.js";
import Student from "@/app/lib/models/Student.model.js";
import connectToMongoDB from "@/app/lib/db.js";
import fetchUser from "@/app/api/middleware/fetchUser";

export async function GET(request) {
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

    if (checkUser.role !== "Student") {
      return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
    }

    // Find the student record to get the correct studentId
    const student = await Student.findOne({ studentID: checkUser.code });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const attendance = await Attendance.find({ studentId: student._id });

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
