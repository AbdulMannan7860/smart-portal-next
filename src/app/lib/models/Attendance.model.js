import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseSchema',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentSchema',
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Leave', 'Absent'],
        required: true
    },
    date: {
        type: Date,
        required: true
    }
},
    { timestamps: true }
);

// Prevent model overwrite error in Next.js
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

export default Attendance;