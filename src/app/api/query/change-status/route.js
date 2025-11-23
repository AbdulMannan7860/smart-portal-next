import { NextResponse } from 'next/server';
import QueryForm from '../../../lib/models/QueryForm.model.js';
import connectToMongoDB from '../../../lib/db.js';
import fetchUser from '../../middleware/fetchUser.js';

export async function PUT(request) {
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

        const { id, status } = await request.json();

        const query = await QueryForm.findById(id);

        if (!query) {
            return NextResponse.json(
                { error: "Query Not Found" },
                { status: 400 }
            );
        }

        query.status = status;

        await query.save();

        return NextResponse.json(
            { message: "Status Changed Successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

