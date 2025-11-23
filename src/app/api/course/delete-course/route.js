import { NextResponse } from 'next/server';
import Course from '../../../lib/models/Course.model.js';
import connectToMongoDB from '../../../lib/db.js';
import fetchUser from '../../middleware/fetchUser.js';

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

        if (checkUser.role !== "Management") {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        const { id } = await request.json();

        const course = await Course.findById(id);

        if (!course) {
            return NextResponse.json(
                { error: "Course Not Found" },
                { status: 400 }
            );
        }

        await Course.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Course Deleted Successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

