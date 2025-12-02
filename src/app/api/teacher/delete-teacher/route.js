import { NextResponse } from 'next/server';
import User from '@/app/lib/models/User.model.js';
import Teacher from '@/app/lib/models/Teacher.model.js';
import connectToMongoDB from '@/app/lib/db.js';
import fetchUser from '@/app/api/middleware/fetchUser';

export async function DELETE(request) {
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

        const { teacherID } = await request.json();

        const teacher = await Teacher.findOne({ teacherID });

        if (!teacher) {
            return NextResponse.json(
                { error: "No Teacher Found" },
                { status: 400 }
            );
        }

        await Teacher.findByIdAndDelete(teacher._id);

        return NextResponse.json(
            { message: "Teacher Deleted Successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

