// USER MODAL

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Management', 'Student', 'Teacher'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userId: {
        type: Number,
        required: false // Only for Student role
    }
}, {
    timestamps: true
});

// Prevent model overwrite error in Next.js
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;