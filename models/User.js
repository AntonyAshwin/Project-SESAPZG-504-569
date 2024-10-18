const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    registrationDate: {
        type: Date,
        default: Date.now, // Automatically set to the current date when a user is created
    },
    role: {
        type: String,
        required: true,
        enum: ['buyer', 'seller'], // Specify the allowed roles
    },
});

module.exports = mongoose.model('User', UserSchema);
