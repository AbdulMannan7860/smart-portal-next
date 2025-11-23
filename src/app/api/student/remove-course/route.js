import { NextResponse } from 'next/server';
import User from '../../../lib/models/User.model.js';
import Student from '../../../lib/models/Student.model.js';
import Course from '../../../lib/models/Course.model.js';
import connectToMongoDB from '../../../lib/db.js';
import fetchUser from '../../middleware/fetchUser.js';

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

        const findIf = await User.findById(checkUser._id);

        if (!findIf) {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        if (checkUser.role !== "Management") {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        const { semester, session, programme, courseCode } = await request.json();

        const allCourse = await Course.find({});

        const courseId = allCourse.find((c) => c.courseCode === courseCode);

        if (!courseId) {
            return NextResponse.json(
                { error: "Course Not Found" },
                { status: 400 }
            );
        }

        const students = await Student.find({ semester, session, programme });

        if (students.length === 0) {
            return NextResponse.json(
                { error: "No Student Found" },
                { status: 400 }
            );
        }

        for (const student of students) {
            if (student.allotedCourses && typeof student.allotedCourses === 'object') {
                for (const key in student.allotedCourses) {
                    if (Array.isArray(student.allotedCourses[key])) {
                        const index = student.allotedCourses[key].findIndex(
                            (c) => c.toString() === courseId._id.toString()
                        );
                        if (index > -1) {
                            student.allotedCourses[key].splice(index, 1);
                        }
                    }
                }
                await student.save();
            }
        }

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

