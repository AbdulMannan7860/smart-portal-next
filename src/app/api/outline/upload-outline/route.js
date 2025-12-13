import connectToMongoDB from "../../../lib/db";
import { NextResponse } from "next/server";
import fetchUser from "../../middleware/fetchUser";
import Schedule from "../../../lib/models/Schedule.model";
import Outline from "../../../lib/models/CourseOutline.model";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    await connectToMongoDB();

    const authResult = await fetchUser(req);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const teacher = authResult.user;

    const formData = await req.formData();
    const courseCode = formData.get("courseCode");
    const teacherName = formData.get("teacherName");
    const day = formData.get("day");
    const session = formData.get("session");
    const room = formData.get("room");
    const startTime = formData.get("startTime");
    const file = formData.get("file");

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    if (!courseCode || !teacherName || !day || !session || !room || !startTime)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const schedules = await Schedule.find({
      courseCode,
      teacherName,
      day,
      session,
      room,
      class_start_time: startTime,
    });

    if (!schedules.length)
      return NextResponse.json({ error: "No schedule found" }, { status: 404 });

    const uniqueSemesters = [...new Set(schedules.map((s) => s.semester))];

    const semesters = Array.from(
      new Map(
        schedules.map((s) => [
          `${s.semester}_${s.program_title}`,
          { semester: s.semester, program_title: s.program_title },
        ])
      ).values()
    );

    const uploadsRoot = path.join(process.cwd(), "public", "course_outlines");
    const teacherFolder = path.join(uploadsRoot, teacher._id.toString());
    const courseFolder = path.join(teacherFolder, courseCode);

    [uploadsRoot, teacherFolder, courseFolder].forEach((folder) => {
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(courseFolder, fileName);
    fs.writeFileSync(filePath, fileBuffer);

    const fileUrl = `/course_outlines/${teacher._id}/${courseCode}/${fileName}`;

    const outlines = semesters.map((sem) => ({
      courseCode,
      courseName: schedules[0].courseName,
      credits: schedules[0].credits,
      program_title: sem.program_title,
      session: schedules[0].session,
      semester: sem.semester,
      teacherName,
      teacherCode: schedules[0].teacherCode,
      fileUrl,
      expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }));

    await Outline.insertMany(outlines);

    return NextResponse.json({
      success: true,
      message: "Outline uploaded successfully",
      fileUrl,
      semesters: uniqueSemesters,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
