import { NextResponse } from 'next/server';
import Schedule from '../../../lib/models/Schedule.model.js';
import Course from '../../../lib/models/Course.model.js';
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

        if (checkUser.role !== "Management") {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        const { id, courseId, time, day } = await request.json();

        const schedule = await Schedule.findOne({ _id: id });

        if (!schedule) {
            return NextResponse.json(
                { error: "Schedule Not Found" },
                { status: 400 }
            );
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return NextResponse.json(
                { error: "Course Not Found" },
                { status: 400 }
            );
        }

        let session = 'Evening';

        const [from, to] = time.split('-');
        const [hour1, minute1] = to.split(':');

        if (parseInt(hour1) < 16) {
            session = 'Morning';
        }

        schedule.courseName = course.courseName;
        schedule.courseCode = course.courseCode;
        schedule.time = time;
        schedule.day = day;
        schedule.session = session;

        await schedule.save();

        return NextResponse.json(schedule, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

