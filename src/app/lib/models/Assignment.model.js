import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true
    },
    teacherCode: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    session: {
        type: String
    },
    semester: {
        type: Array
    },
    assigmentFile: {
        type: String
    },
    uploadedAssignment: {
        studentCode: {
            type: String
        },
        uploadedFile: {
            type: String
        },
        submitDate: {
            type: Date
        }
    }
});

// Prevent model overwrite error in Next.js
const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

export default Assignment;