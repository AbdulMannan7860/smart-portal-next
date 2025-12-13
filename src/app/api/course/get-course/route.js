import { NextResponse } from "next/server";
import Course from "../../../lib/models/Course.model.js";
import connectToMongoDB from "../../../lib/db.js";
import fetchUser from "../../middleware/fetchUser";;

// Need to create this route according to user roles.
// If the user is a teacher, they should only be able to see the courses they are teaching.
// If the user is a student, they should only be able to see the courses they are enrolled in.
// If the user is a management, they should be able to see all the courses.
export async function GET(request) {
  try {
    await connectToMongoDB();

    const courses = await Course.find({});

    return NextResponse.json(
      { success: "Courses Fetched Successfully.", data: courses },
      { data: courses },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
