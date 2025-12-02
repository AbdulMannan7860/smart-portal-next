import { NextResponse } from 'next/server';
import User from '@/app/lib/models/User.model.js';
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

        const findUser = await User.findOne({ _id: user._id });

        if (!findUser) {
            return NextResponse.json(
                { error: "User Not Found" },
                { status: 400 }
            );
        }

        if (user.role !== "Management") {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        const teacherUsers = await User.find({ role: "Teacher" });

        return NextResponse.json(teacherUsers, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

