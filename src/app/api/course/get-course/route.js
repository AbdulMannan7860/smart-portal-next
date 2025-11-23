import { NextResponse } from 'next/server';
import Course from '../../../lib/models/Course.model.js';
import connectToMongoDB from '../../../lib/db.js';

export async function GET(request) {
    try {
        await connectToMongoDB();

        const courses = await Course.find({});

        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

