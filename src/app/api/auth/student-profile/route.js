import connectToMongoDB from "@/app/lib/db";
import User from "@/app/lib/models/User.model";
import { NextResponse } from "next/server";
import fetchUser from "@/app/api/middleware/fetchUser";

const MASTER_DB_API_URL = process.env.MASTER_DB_API_URL || "";

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

    const findUser = await User.findById(user._id);

    if (!findUser) {
      return NextResponse.json({ error: "User Not Found" }, { status: 400 });
    }

    let masterDbData;
    try {
      const masterDbResponse = await fetch(
        `${MASTER_DB_API_URL}/students/${user.userId}`,
        {
          method: "GET",
        }
      );
      masterDbData = await masterDbResponse.json();
    } catch (fetchError) {
      console.error("Master DB API fetch error:", fetchError);
      return NextResponse.json(
        {
          error: "Failed to connect to Master Database",
          details: fetchError.message,
        },
        { status: 500 }
      );
    }

    if (masterDbData.error) {
      return NextResponse.json({ error: masterDbData.error }, { status: 500 });
    }

    const response = NextResponse.json(
      { success: "Student Profile Fetched Successfully.", data: masterDbData },
      { data: masterDbData },
      { status: 200 }
    );

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
