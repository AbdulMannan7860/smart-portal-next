import { NextResponse } from 'next/server';
import User from '../../../lib/models/User.model.js';
import Teacher from '../../../lib/models/Teacher.model.js';
import connectToMongoDB from '../../../lib/db.js';
import fetchUser from '../../middleware/fetchUser.js';

const titleCase = (str) => {
    return str
        .trim()
        .replace(/\s+/g, " ")
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

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

        const findIf = await User.findById(checkUser._id);

        if (!findIf) {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        if (findIf.role !== "Management") {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        const { teacherID, fullName, email, session, status } = await request.json();

        const teacher = await Teacher.findOne({ teacherID });

        if (!teacher) {
            return NextResponse.json(
                { error: "No Teacher Found" },
                { status: 400 }
            );
        }

        teacher.fullName = titleCase(fullName);
        teacher.email = email;
        teacher.session = titleCase(session);
        teacher.status = titleCase(status);

        await teacher.save();
        return NextResponse.json(teacher, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

