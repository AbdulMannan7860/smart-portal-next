import { NextResponse } from "next/server";
import Attendance from "@/app/lib/models/Attendance.model.js";
import User from "@/app/lib/models/User.model.js";
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

    const user = authResult.user;

    const validateUser = await User.findById(user._id);

    if (!validateUser || validateUser.role === "Student") {
      return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
    }

    const attendance = await Attendance.find({});

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
