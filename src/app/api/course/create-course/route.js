import { NextResponse } from "next/server";
import Course from "../../../lib/models/Course.model.js";
import connectToMongoDB from "../../../lib/db.js";
import fetchUser from "../../middleware/fetchUser";;

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

    const { courseCode, courseName, credits } = await request.json();

    const course = await Course.findOne({ courseCode });

    if (course) {
      return NextResponse.json(
        { error: "Course Already Exists" },
        { status: 400 }
      );
    }

    const newCourse = new Course({
      courseCode,
      courseName,
      credits: credits || 3,
    });

    await newCourse.save();

    return NextResponse.json(newCourse, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
