import { NextResponse } from "next/server";
import Assignment from "../../../lib/models/Assignment.model.js";
import Teacher from "../../../lib/models/Teacher.model.js";
import User from "../../../lib/models/User.model.js";
import connectToMongoDB from "../../../lib/db.js";
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

    if (!validateUser) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
    }

    const teacher = await Teacher.findOne({ email: validateUser.code });

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
      day,
    } = await request.json();

    const validateData = [
      courseCode,
      title,
      description,
      dueDate,
      marks,
      session,
      day,
    ];

    for (const field of validateData) {
      if (!field) {
        return NextResponse.json(
          { error: "Please provide all required fields. Missing field: " + field },
          { status: 400 }
        );
      }
    }

    const assignment = new Assignment({
      courseCode,
      teacherCode: teacher.teacherID,
      title,
      description,
      dueDate,
      marks,
      session,
      day,
    });

    await assignment.save();

    return NextResponse.json({
      success: true,
      message: "Assignment uploaded successfully",
      assignment,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
