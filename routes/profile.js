const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to protect routes

// Profile route to get user details
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Extract user ID from the JWT token
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Fetch user details from the database
        const user = await User.findById(userId).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Profile route to verify old password
router.post('/verify-password', authMiddleware, async (req, res) => {
    const { oldPassword } = req.body;

    try {
        // Extract user ID from the JWT token
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Fetch user details from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        res.json({ message: 'Old password is correct' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Profile route to update user details
router.put('/', authMiddleware, async (req, res) => {
    const { name, email, password, oldPassword, address, phoneNumber, publicKey, aadhaarCardNumber, pan, gstin, businessAddress, businessLicense } = req.body;

    try {
        // Extract user ID from the JWT token
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Fetch user details from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Confirm old password if changing to a new password
        if (password) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        // Update user details
        if (name) user.name = name;
        if (email) user.email = email;
        if (address) user.address = address;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (publicKey) user.publicKey = publicKey;
        if (aadhaarCardNumber) user.aadhaarCardNumber = aadhaarCardNumber;
        if (pan) user.pan = pan;
        if (gstin) user.gstin = gstin;
        if (businessAddress) user.businessAddress = businessAddress;
        if (businessLicense) user.businessLicense = businessLicense;

        await user.save();

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;