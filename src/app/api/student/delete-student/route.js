import { NextResponse } from 'next/server';
import User from '../../../lib/models/User.model.js';
import Student from '../../../lib/models/Student.model.js';
import connectToMongoDB from '../../../lib/db.js';
import fetchUser from "../../middleware/fetchUser";

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

        const { studentID } = await request.json();

        const student = await Student.findOne({ studentID });

        if (!student) {
            return NextResponse.json(
                { error: "No Student Found" },
                { status: 400 }
            );
        }

        await Student.findByIdAndDelete(student._id);

        return NextResponse.json(
            { message: "Student Deleted Successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

