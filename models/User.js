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
    dateOfBirth: {
        type: Date,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    aadhaarCardNumber: {
        type: String,
        required: true,
        unique: true,
    },
    pan: {
        type: String,
        required: true,
        unique: true,
    },
    gstin: {
        type: String,
        required: function() {
            return this.role === 'seller';
        },
        unique: true,
    },
    businessAddress: {
        type: String,
        required: function() {
            return this.role === 'seller';
        },
    },
    businessLicense: {
        type: String,
        required: function() {
            return this.role === 'seller';
        },
    },
});

module.exports = mongoose.model('User', UserSchema);