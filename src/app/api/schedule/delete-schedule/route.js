import { NextResponse } from 'next/server';
import Schedule from '../../../lib/models/Schedule.model.js';
import connectToMongoDB from '../../../lib/db.js';
import fetchUser from '../../middleware/fetchUser.js';

export async function DELETE(request) {
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

        const { id } = await request.json();

        const schedule = await Schedule.findOne({ _id: id });

        if (!schedule) {
            return NextResponse.json(
                { error: "Schedule Not Found" },
                { status: 400 }
            );
        }

        await Schedule.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Schedule Deleted Successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

