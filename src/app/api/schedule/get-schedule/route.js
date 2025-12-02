import { NextResponse } from "next/server";
import Schedule from "@/app/lib/models/Schedule.model.js";
import connectToMongoDB from "@/app/lib/db.js";
import fetchUser from "@/app/api/middleware/fetchUser";
import User from "@/app/lib/models/User.model.js";
import Teacher from "@/app/lib/models/Teacher.model.js";

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

    const checkUser = authResult.user;

    const findUser = await User.findById(checkUser._id);

    if (!findUser) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
    }

    let schedule;
    if (checkUser.role === "Management") {
      schedule = await Schedule.find();
    } else if (checkUser.role === "Teacher") {
      const findTeacher = await Teacher.findOne({ email: findUser.code });

      if (!findTeacher) {
        return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
      }

      schedule = await Schedule.find({
        teacherCode: findTeacher.teacherID,
        status: "Active",
      });
    } else if (checkUser.role === "Student") {
      let masterDbData;
      try {
        const masterDbResponse = await fetch(
          `${MASTER_DB_API_URL}/students/${checkUser.userId}`,
          {
            method: "GET",
          }
        );

        masterDbData = await masterDbResponse.json();

        const session =
          masterDbData.Reg_no.split("-")[1].split("/")[0] === "M"
            ? "Morning"
            : "Evening";
        schedule = await Schedule.find({
          program_title: masterDbData.Prog_Title,
          semester: masterDbData.sems_Name,
          session,
        });
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
        return NextResponse.json(
          { error: masterDbData.error },
          { status: 500 }
        );
      }
    }

    const response = NextResponse.json(
      { success: "Schedule Fetched Successfully.", data: schedule },
      { status: 200 }
    );

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
