const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as necessary

// Route to get user details by public key
router.get('/:publicKey', async (req, res) => {
    try {
        const { publicKey } = req.params;

        // Fetch user details from the database by public key
        const user = await User.findOne({ publicKey }).select('name role businessAddress'); // Select only necessary fields
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare response data
        const responseData = {
            name: user.name,
            role: user.role,
        };

        // Include business address if the role is seller
        if (user.role === 'seller') {
            responseData.businessAddress = user.businessAddress;
        }

        res.json(responseData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;