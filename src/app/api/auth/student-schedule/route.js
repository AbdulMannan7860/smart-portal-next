import connectToMongoDB from "../../../lib/db";
import User from "../../../lib/models/User.model";
import { NextResponse } from "next/server";
import fetchUser from "../../middleware/fetchUser";
import getLatestSemesterData from "../../../lib/getLatestSemesterData";
import Course from "../../../lib/models/Course.model";
import Schedule from "../../../lib/models/Schedule.model";

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

    if (!findUser) {
      return NextResponse.json({ error: "User Not Found" }, { status: 400 });
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
      return NextResponse.json({ error: masterDbData.error }, { status: 500 });
    }

    const getData = getLatestSemesterData(masterDbData);

    for (const course of getData) {
      const checkCourse = await Course.findOne({
        courseCode: course.code,
      });

      if (checkCourse) {
        console.log("Course already exists");
        continue;
      }

      if (!checkCourse) {
        const newCourse = new Course({
          courseCode: course.code,
          courseName: course.name,
          credits: course.credit || 3,
        });

        await newCourse.save();
      }
    }

    const session =
      studentDetails.Reg_no.split("-")[1].split("/")[0] === "M"
        ? "Morning"
        : "Evening";
    const findCourses = await Schedule.find({
      program_title: studentDetails?.Prog_Title,
      semester: studentDetails?.sems_Name,
      session,
    });

    const returnData = getData.map((item, index) => {
      const findCourse = findCourses.filter(
        (course) => course.courseCode === item.code
      );
      const instructor = findCourse[0]?.teacherName || "---";
      return {
        id: index + 1,
        code: item.code,
        name: item.name,
        instructor,
      };
    });

    const response = NextResponse.json(
      { success: "Schedule Fetched Successfully.", data: returnData },
      { data: returnData },
      { status: 200 }
    );

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
