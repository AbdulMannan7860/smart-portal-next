import { NextResponse } from 'next/server';
import User from '../../../lib/models/User.model.js';
import Student from '../../../lib/models/Student.model.js';
import Course from '../../../lib/models/Course.model.js';
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

        const { semester, session, programme, courseCode, changeAbleSemester } = await request.json();

        const allCourse = await Course.find({});

        const studentSemesterSpace = changeAbleSemester.split(' ').join('_');

        const filter = {
            programme,
            session: titleCase(session),
            semester
        };

        const students = await Student.find(filter);

        if (students.length === 0) {
            return NextResponse.json(
                { error: "No Student Found" },
                { status: 400 }
            );
        }

        const updatePromises = students.map(async (student) => {
            if (!student.allotedCourses) {
                student.allotedCourses = {};
                student.allotedCourses[studentSemesterSpace] = [];
            }

            const courseId = allCourse.find((c) => c.courseCode === courseCode);
            
            if (!courseId) {
                return;
            }

            if (!student.allotedCourses[studentSemesterSpace]) {
                student.allotedCourses[studentSemesterSpace] = [];
            }

            const courseExists = student.allotedCourses[studentSemesterSpace].some(
                (c) => c.toString() === courseId._id.toString()
            );

            if (!courseExists) {
                student.allotedCourses[studentSemesterSpace].push(courseId._id);
                await student.save();
            }
        });

        await Promise.all(updatePromises);

        const updatedStudents = await Student.find(filter);

        if (updatedStudents.length === 0) {
            return NextResponse.json(
                { error: "No Student Found or Course Already Added" },
                { status: 400 }
            );
        }

        return NextResponse.json(updatedStudents, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

