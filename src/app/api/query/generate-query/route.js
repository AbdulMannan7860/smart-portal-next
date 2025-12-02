import { NextResponse } from 'next/server';
import QueryForm from '@/app/lib/models/QueryForm.model.js';
import connectToMongoDB from '@/app/lib/db.js';
import fetchUser from '@/app/api/middleware/fetchUser';

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

        if (checkUser.role !== "Student") {
            return NextResponse.json(
                { error: "Not Authorized" },
                { status: 400 }
            );
        }

        const { departmentName, reason, description } = await request.json();

        const studentId = checkUser._id;

        const generateUniqueTicket = Math.floor(100000000 + Math.random() * 900000000);

        const query = [{
            reason,
            description
        }];

        const checkQuery = await QueryForm.findOne({ studentId, departmentName, query });

        if (checkQuery) {
            return NextResponse.json(
                { error: "Query Already Generated. Please wait...." },
                { status: 400 }
            );
        }

        const newQuery = new QueryForm({
            studentId,
            ticket: generateUniqueTicket,
            departmentName,
            status: "Pending",
            query
        });

        await newQuery.save();

        return NextResponse.json(
            { message: "Query Generated Successfully", ticket: newQuery.ticket, status: newQuery.status },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

