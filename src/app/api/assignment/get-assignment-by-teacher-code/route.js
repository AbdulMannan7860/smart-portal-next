import { NextResponse } from "next/server";
import Assignment from "../../../lib/models/Assignment.model.js";
import connectToMongoDB from "../../../lib/db.js";
import User from "../../../lib/models/User.model.js";
import Teacher from "../../../lib/models/Teacher.model";
import fetchUser from "../../middleware/fetchUser";

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

    const user = authResult.user;

    const validateUser = await User.findById(user._id);

    if (!validateUser || validateUser.role !== "Teacher") {
      return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
    }

    const teacher = await Teacher.findOne({ email: validateUser.code });

    const teacherCode = teacher.teacherID;

    const assignments = await Assignment.find({ teacherCode });

    return NextResponse.json(
      {
        success: "Assignments Fetched Successfully.",
        data: assignments,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
