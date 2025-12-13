import { NextResponse } from "next/server";
import Assignment from "../../../lib/models/Assignment.model.js";
import Student from "../../../lib/models/Student.model.js";
import User from "../../../lib/models/User.model.js";
import connectToMongoDB from "../../../lib/db.js";
import fetchUser from "../../middleware/fetchUser";;

export async function GET(request, { params }) {
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

    if (!validateUser || validateUser.role !== "Student") {
      return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
    }

    const { courseCode, day, session } = params;

    if (!student) {
      return NextResponse.json({ error: "No Student Found" }, { status: 400 });
    }

    const assignments = await Assignment.find({
      courseCode,
      session,
      day,
    });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
