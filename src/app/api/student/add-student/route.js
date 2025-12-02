import { NextResponse } from 'next/server';
import User from '@/app/lib/models/User.model.js';
import Student from '@/app/lib/models/Student.model.js';
import connectToMongoDB from '@/app/lib/db.js';
import fetchUser from '@/app/api/middleware/fetchUser';

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

        const {
            studentID,
            regNo,
            fullName,
            email,
            dob,
            gender,
            programme,
            session,
            semester,
            placeOfBirth,
            nationality,
            cnicBForm,
            studentPhone,
            fatherName,
            isZero,
            status,
            refFrom
        } = await request.json();

        if (!studentID || !fullName || !email || !dob || !gender || !programme || !session || !semester || !placeOfBirth || !nationality || !cnicBForm || !studentPhone || !fatherName || !status || !refFrom) {
            return NextResponse.json(
                { error: "All Fields Are Required" },
                { status: 400 }
            );
        }

        const newStudent = new Student({
            user: checkUser._id,
            studentID,
            regNo,
            fullName: titleCase(fullName),
            email,
            dob,
            gender: titleCase(gender),
            programme,
            session: titleCase(session),
            semester,
            placeOfBirth: titleCase(placeOfBirth),
            nationality: titleCase(nationality),
            cnicBForm,
            studentPhone,
            fatherName: titleCase(fatherName),
            isZero,
            status: titleCase(status),
            refFrom: titleCase(refFrom),
            allotedCourses: {}
        });

        await newStudent.save();

        return NextResponse.json(
            { message: "Student Added Successfully", data: newStudent },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

