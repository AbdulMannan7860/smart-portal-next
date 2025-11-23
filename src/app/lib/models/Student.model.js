// Student Schema

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    studentID: {
        type: String,
        required: true
    },
    regNo: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    programme: {
        type: String,
        required: true
    },
    session: {
        type: String,
        enum: ['Morning', 'Evening'],
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    placeOfBirth: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    cnicBForm: {
        type: String,
        required: true
    },
    studentPhone: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    isZero: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    refFrom: {
        type: String,
        required: true
    },
    allotedCourses: {
        type: Object,
        required: true
    }
});

// Prevent model overwrite error in Next.js
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;