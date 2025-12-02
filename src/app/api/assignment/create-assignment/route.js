import { NextResponse } from "next/server";
import Assignment from "@/app/lib/models/Assignment.model.js";
import Student from "@/app/lib/models/Student.model.js";
import Teacher from "@/app/lib/models/Teacher.model.js";
import User from "@/app/lib/models/User.model.js";
import connectToMongoDB from "@/app/lib/db.js";
import fetchUser from "../../middleware/fetchUser";

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

    const teacher = await Teacher.findOne({ teacherID: validateUser.code });

    if (!teacher || validateUser.role !== "Teacher") {
      return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
    }

    const {
      courseCode,
      title,
      description,
      dueDate,
      marks,
      session,
      semester,
    } = await request.json();

    const checkSemesterType = typeof semester;
    if (checkSemesterType !== "string") {
      return NextResponse.json(
        { error: "Semester is not a string" },
        { status: 400 }
      );
    }

    const splitSemesterIfComma = semester.includes(",");

    let semesterArray = [];
    if (splitSemesterIfComma) {
      const breakSemester = semester.split(",");
      for (const s of breakSemester) {
        semesterArray.push(s.trim());
      }
    }

    const checkStudentCourses = await Student.findOne({ semester, session });

    if (!checkStudentCourses) {
      return NextResponse.json({ error: "No Student Found" }, { status: 400 });
    }

    const assignment = new Assignment({
      courseCode,
      teacherCode: teacher.teacherID,
      title,
      description,
      dueDate,
      marks,
      session,
      semester: splitSemesterIfComma ? semesterArray : semester,
    });

    await assignment.save();

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
