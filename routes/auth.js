const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Register Route
router.post('/register', async (req, res) => {
    const {
        name,
        email,
        password,
        role,
        dateOfBirth,
        address,
        phoneNumber,
        aadhaarCardNumber,
        publicKey,
        pan,
        gstin,
        businessAddress,
        businessLicense
    } = req.body;

    // Validate role
    if (!['buyer', 'seller'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    // Validate mandatory fields
    if (!name || !email || !password || !dateOfBirth || !address || !phoneNumber || !aadhaarCardNumber || !pan || !publicKey) {
        return res.status(400).json({ message: 'All mandatory fields must be provided' });
    }

    // Additional validation for sellers
    if (role === 'seller' && (!gstin || !businessAddress || !businessLicense)) {
        return res.status(400).json({ message: 'All seller-specific fields must be provided' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        dateOfBirth,
        address,
        phoneNumber,
        aadhaarCardNumber,
        publicKey,
        pan,
        gstin: role === 'seller' ? gstin : undefined,
        businessAddress: role === 'seller' ? businessAddress : undefined,
        businessLicense: role === 'seller' ? businessLicense : undefined,
    });

    try {
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create and return JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
