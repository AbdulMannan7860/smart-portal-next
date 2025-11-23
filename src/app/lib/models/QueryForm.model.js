import mongoose from "mongoose";

const queryFormSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentSchema',
        required: true
    },
    departmentName: {
        type: String,
        required: true
    },
    ticket: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Answered', 'Closed'],
        required: true
    },
    query: [{
        reason: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }]
},
    {
        timestamps: true
    }
);

// Prevent model overwrite error in Next.js
const QueryForm = mongoose.models.QueryForm || mongoose.model('QueryForm', queryFormSchema);

export default QueryForm;