import { NextResponse } from 'next/server';
import User from '@/app/lib/models/User.model.js';
import Student from '@/app/lib/models/Student.model.js';
import connectToMongoDB from '@/app/lib/db.js';
import fetchUser from '@/app/api/middleware/fetchUser';

export async function GET(request) {
    try {
        await connectToMongoDB();
        
        const authResult = await fetchUser(request);
        if (authResult.error) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const user = authResult.user;

        const findIf = await User.findById(user._id);

        if (!findIf) {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        const students = await Student.find();

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

