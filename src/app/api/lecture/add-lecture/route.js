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
        const class_session = formData.get("class_session");
        const startTime = formData.get("startTime");
        const file = formData.get("file");

        const fields = {
            courseCode,
            teacherName,
            day,
            session,
            room,
            startTime,
            class_session,
            file,
        };

        for (const [key, value] of Object.entries(fields)) {
            if (!value) {
                return NextResponse.json(
                    { error: `${key} is required` },
                    { status: 400 }
                );
            }
        }

        const schedules = await Schedule.find({
            courseCode,
            teacherName,
            day,
            session,
            room,
            class_start_time: startTime,
        });

        if (!schedules.length) {
            return NextResponse.json(
                { error: "No schedule found for this class" },
                { status: 404 }
            );
        }

        const semesters = Array.from(
            new Map(
                schedules.map((s) => [
                    `${s.semester}_${s.program_title}`,
                    { semester: s.semester, program_title: s.program_title },
                ])
            ).values()
        );

        const baseInfo = schedules[0];

        let fileUrl = "";
        let fileName = "";
        let filePath = "";

        const isLink = typeof file === "string" || file instanceof URL;

        if (isLink) {
            fileUrl = file.toString();
        } else {
            const uploadsRoot = path.join(process.cwd(), "public", "course_lectures");
            const teacherFolder = path.join(uploadsRoot, teacher._id.toString());
            const courseFolder = path.join(teacherFolder, courseCode);

            [uploadsRoot, teacherFolder, courseFolder].forEach((folder) => {
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true });
                }
            });

            const fileBuffer = Buffer.from(await file.arrayBuffer());
            fileName = `${Date.now()}_${file.name}`;
            filePath = path.join(courseFolder, fileName);
            fs.writeFileSync(filePath, fileBuffer);

            fileUrl = `/course_lectures/${teacher._id}/${courseCode}/${fileName}`;
        }

        const findOutline = await Outline.findOne({
            courseCode: baseInfo.courseCode,
            teacherCode: baseInfo.teacherCode,
            class_session,
            fileUrl,
        });

        if (findOutline) {
            return NextResponse.json(
                { error: "This outline has already been uploaded" },
                { status: 400 }
            );
        }

        const outlines = semesters.map((item) => ({
            courseCode: baseInfo.courseCode,
            courseName: baseInfo.courseName,
            credits: baseInfo.credits,
            program_title: item.program_title,
            class_session,
            session: baseInfo.session,
            semester: item.semester,
            teacherName,
            teacherCode: baseInfo.teacherCode,
            fileUrl,
            expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }));

        await Outline.insertMany(outlines);

        return NextResponse.json({
            success: true,
            message: isLink
                ? "Outline link saved successfully"
                : "Outline file uploaded successfully",
            fileUrl,
            totalInserted: outlines.length,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
