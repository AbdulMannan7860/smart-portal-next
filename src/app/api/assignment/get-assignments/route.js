import { NextResponse } from 'next/server';
import Assignment from '../../../lib/models/Assignment.model.js';
import User from '../../../lib/models/User.model.js';
import connectToMongoDB from '../../../lib/db.js';
import fetchUser from '../../middleware/fetchUser.js';

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

        const validateUser = await User.findById(user._id);

        if (!validateUser || validateUser.role !== "Management") {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        const assignments = await Assignment.find({});

        return NextResponse.json(assignments, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

