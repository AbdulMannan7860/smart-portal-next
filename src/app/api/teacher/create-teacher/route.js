import { NextResponse } from 'next/server';
import User from '../../../lib/models/User.model.js';
import Teacher from '../../../lib/models/Teacher.model.js';
import connectToMongoDB from '../../../lib/db.js';
import fetchUser from "../../middleware/fetchUser";

const titleCase = (str) => {
    return str
        .trim()
        .replace(/\s+/g, " ")
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export async function POST(request) {
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
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        if (findUser.role !== "Management") {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        const { teacherID, fullName, email, session, status } = await request.json();

        const findIf = await Teacher.findOne({ teacherID });

        if (findIf) {
            return NextResponse.json(
                { error: "Teacher already exists" },
                { status: 400 }
            );
        }

        const newTeacher = new Teacher({
            teacherID,
            fullName: titleCase(fullName),
            email,
            session: titleCase(session),
            status: titleCase(status),
            assignedCourses: [],
        });

        await newTeacher.save();

        return NextResponse.json(newTeacher, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

