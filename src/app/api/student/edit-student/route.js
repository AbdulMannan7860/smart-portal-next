import { NextResponse } from 'next/server';
import User from '../../../lib/models/User.model.js';
import Student from '../../../lib/models/Student.model.js';
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

        const { studentID, regNo, fullName, email, dob, gender, programme, session, semester, placeOfBirth, nationality, cnicBForm, studentPhone, fatherName, isZero, status, refFrom } = await request.json();

        if (!studentID || !fullName || !email || !dob || !gender || !programme || !session || !semester || !placeOfBirth || !nationality || !cnicBForm || !studentPhone || !fatherName || !status || !refFrom) {
            return NextResponse.json(
                { error: "All Fields Are Required" },
                { status: 400 }
            );
        }

        const student = await Student.findOne({ studentID });

        if (!student) {
            return NextResponse.json(
                { error: "No Student Found" },
                { status: 400 }
            );
        }

        student.studentID = studentID;
        student.regNo = regNo;
        student.fullName = titleCase(fullName);
        student.email = email;
        student.dob = dob;
        student.gender = titleCase(gender);
        student.programme = programme;
        student.session = titleCase(session);
        student.semester = semester;
        student.placeOfBirth = titleCase(placeOfBirth);
        student.nationality = titleCase(nationality);
        student.cnicBForm = cnicBForm;
        student.studentPhone = studentPhone;
        student.fatherName = titleCase(fatherName);
        student.isZero = isZero;
        student.status = titleCase(status);
        student.refFrom = refFrom;

        await student.save();

        return NextResponse.json(student, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

