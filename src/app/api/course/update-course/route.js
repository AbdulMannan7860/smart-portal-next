import { NextResponse } from 'next/server';
import Course from '../../../lib/models/Course.model.js';
import connectToMongoDB from '../../../lib/db.js';
import fetchUser from "../../middleware/fetchUser";

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

        if (checkUser.role !== "Management") {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        const { id, courseName, courseCode } = await request.json();

        const course = await Course.findOne({ _id: id });

        if (!course) {
            return NextResponse.json(
                { error: "Course Not Found" },
                { status: 400 }
            );
        }

        course.courseName = courseName;
        course.courseCode = courseCode;

        await course.save();

        return NextResponse.json(course, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

