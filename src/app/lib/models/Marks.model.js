import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    marks: [{
        semester: {
            type: String,
        },
        courseCode: {
            type: String
        },
        teacherCode: {
            type: String
        },
        assignmentMarks: [{
            obtained: {
                type: Number
            },
            outOf: {
                type: Number
            },
            title: {
                type: String
            }
        }],
        quizMarks: [{
            obtained: {
                type: Number
            },
            outOf: {
                type: Number
            },
            title: {
                type: String
            }
        }],
        midTerm: [{
            obtained: {
                type: Number
            },
            outOf: {
                type: Number
            },
        }],
        finalTerm: [{
            obtained: {
                type: Number
            },
            outOf: {
                type: Number
            },
        }]
    }]
});

// Prevent model overwrite error in Next.js
const Marks = mongoose.models.Marks || mongoose.model('Marks', marksSchema);

export default Marks;