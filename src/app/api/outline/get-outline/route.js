import connectToMongoDB from "@/app/lib/db";
import CourseOutline from "@/app/lib/models/CourseOutline.model";
import { NextResponse } from "next/server";
import fetchUser from "../../middleware/fetchUser";
import User from "@/app/lib/models/User.model";
import getLatestSemesterData from "@/app/lib/getLatestSemesterData";

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

    if (findUser.role === "Student") {
      try {
        let studentDetails;

        try {
          const masterDbResponse = await fetch(
            `${MASTER_DB_API_URL}/students/${user.userId}`,
            {
              method: "GET",
            }
          );
          studentDetails = await masterDbResponse.json();
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

        if (!studentDetails) {
          return NextResponse.json(
            { error: "User Not Found" },
            { status: 400 }
          );
        }

        let masterDbData;
        try {
          const masterDbResponse = await fetch(
            `${MASTER_DB_API_URL}/students/${user.userId}/Schedule-Class`,
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
          return NextResponse.json(
            { error: masterDbData.error },
            { status: 500 }
          );
        }

        const getData = getLatestSemesterData(masterDbData);

        if (getData.error) {
          return NextResponse.json({ error: getData.error }, { status: 500 });
        }

        let response = [];

        const session =
          studentDetails.Reg_no.split("-")[1].split("/")[0] === "M"
            ? "Morning"
            : "Evening";

        for (const course of getData) {
          const courseOutline = await CourseOutline.findOne({
            courseCode: course.code,
            program_title: studentDetails.Prog_Title,
            session: session,
            semester: studentDetails.sems_Name,
          });
          if (courseOutline) {
            response.push(courseOutline);
          }
        }

        return NextResponse.json(
          { success: "Course Outline Fetched Successfully.", data: response },
          { data: response },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else if (findUser.role === "Teacher") {
    }

    let courses;

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
