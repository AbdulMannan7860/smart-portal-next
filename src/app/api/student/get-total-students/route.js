import { NextResponse } from "next/server";
import Schedule from "../../../lib/models/Schedule.model.js";
import connectToMongoDB from "../../../lib/db.js";
import fetchUser from "../../../api/middleware/fetchUser";
import User from "../../../lib/models/User.model.js";
import Teacher from "../../../lib/models/Teacher.model.js";

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

        let studentData = [];
        if (checkUser.role === "Teacher") {
            const findTeacher = await Teacher.findOne({ email: findUser.code });

            if (!findTeacher) {
                return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
            }

            const schedule = await Schedule.find({
                teacherCode: findTeacher.teacherID,
                status: "Active",
            });

            for (const entry of schedule) {
                const program = entry.program_title;
                const semester = entry.semester;
                const shift = entry.session;

                const masterDbResponse = await fetch(
                    `${MASTER_DB_API_URL}/strength/${program}/${semester}/${shift}`,
                    {
                        method: "GET",
                    }
                );

                const masterDbData = await masterDbResponse.json();

                if (Array.isArray(masterDbData)) {
                    studentData.push(...masterDbData);
                } else if (masterDbData?.data && Array.isArray(masterDbData.data)) {
                    studentData.push(...masterDbData.data);
                } else {
                    console.log("Unexpected master DB response:", masterDbData, 'against', program, semester, shift);
                }
            }
        }
        const response = NextResponse.json(
            { success: "Schedule Fetched Successfully.", data: studentData },
            { status: 200 }
        );

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
