import connectToMongoDB from "../../../lib/db";
import CourseOutline from "../../../lib/models/CourseOutline.model";
import { NextResponse } from "next/server";
import fetchUser from "../../middleware/fetchUser";
import User from "../../../lib/models/User.model";
import Teacher from "../../../lib/models/Teacher.model";

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
    const { fileUrl } = await request.json();
    
    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    const findUser = await User.findById(user._id);

    if (findUser.role === "Teacher") {
      const findTeacher = await Teacher.findOne({ email: findUser.code });

      if (!findTeacher) {
        return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
      }

      const outlines = await CourseOutline.find({
        fileUrl,
        teacherCode: findTeacher.teacherID,
      });

      if (outlines.length === 0) {
        return NextResponse.json(
          { error: "Course Outline Not Found" },
          { status: 400 }
        );
      }
      
      await CourseOutline.deleteMany({ fileUrl });

      return NextResponse.json(
        {
          success: "Course Outlines Deleted Successfully.",
          deletedCount: outlines.length,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Not Authorized" }, { status: 403 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
