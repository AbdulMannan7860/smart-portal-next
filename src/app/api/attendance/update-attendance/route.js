import { NextResponse } from "next/server";
import Attendance from "@/app/lib/models/Attendance.model.js";
import connectToMongoDB from "@/app/lib/db.js";
import fetchUser from "@/app/api/middleware/fetchUser";

export async function PUT(request) {
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

    const { id, status } = await request.json();

    const attendance = await Attendance.findOne({ _id: id });

    if (!attendance) {
      return NextResponse.json(
        { error: "Attendance Not Found" },
        { status: 400 }
      );
    }

    attendance.status = status;

    await attendance.save();

    return NextResponse.json(
      { message: "Attendance Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
