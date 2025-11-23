import connectToMongoDB from "@/app/lib/db";
import { NextResponse } from "next/server";
import fetchUser from "../../middleware/fetchUser";
import Teacher from "@/app/lib/models/Teacher.model";

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

    const findUser = await Teacher.findOne({ email: user.code });

    if (!findUser) {
      return NextResponse.json({ error: "User Not Found" }, { status: 400 });
    }

    const response = NextResponse.json(
      { success: "Student Profile Fetched Successfully.", data: findUser },
      { data: findUser },
      { status: 200 }
    );

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
