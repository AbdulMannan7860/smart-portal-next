import { NextResponse } from 'next/server';
import User from '../../../lib/models/User.model.js';
import Teacher from '../../../lib/models/Teacher.model.js';
import Course from '../../../lib/models/Course.model.js';
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

        const { teacherID, courseCode, session } = await request.json();

        const teacher = await Teacher.findOne({ teacherID });

        if (!teacher) {
            return NextResponse.json(
                { error: "No Teacher Found" },
                { status: 400 }
            );
        }

        const findCourse = await Course.findOne({ courseCode });

        if (!findCourse) {
            return NextResponse.json(
                { error: "No Course Found" },
                { status: 400 }
            );
        }

        if (teacher.assignedCourses.length > 0) {
            for (const course of teacher.assignedCourses) {
                if (course.courseCode === courseCode && course.session === titleCase(session)) {
                    return NextResponse.json(
                        { error: "Course Already Assigned" },
                        { status: 400 }
                    );
                }
            }
        }

        const data = {
            courseCode,
            courseName: findCourse?.courseName,
            session: titleCase(session)
        };
        teacher.assignedCourses.push(data);

        await teacher.save();
        return NextResponse.json(teacher, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

