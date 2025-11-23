import { NextResponse } from 'next/server';
import User from '../../../lib/models/User.model.js';
import Teacher from '../../../lib/models/Teacher.model.js';
import connectToMongoDB from '../../../lib/db.js';
import fetchUser from '../../middleware/fetchUser.js';

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

        const { teacherID, id } = await request.json();

        const teacher = await Teacher.findOne({ teacherID });

        if (!teacher) {
            return NextResponse.json(
                { error: "No Teacher Found" },
                { status: 400 }
            );
        }

        teacher.assignedCourses = teacher.assignedCourses.filter((course) => {
            return course._id.toString() !== id;
        });

        await teacher.save();
        return NextResponse.json(teacher, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

