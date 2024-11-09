const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to protect routes

// Route to add a new transaction
router.post('/', authMiddleware, async (req, res) => {
    const { goldId, transactionType } = req.body;

    // Validate input
    if (!goldId || !transactionType) {
        return res.status(400).json({ message: 'Gold ID and transaction type are required' });
    }

    if (!['register', 'transfer'].includes(transactionType)) {
        return res.status(400).json({ message: 'Invalid transaction type' });
    }

    try {
        // Extract user information from the JWT token
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Fetch user details to check the role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (transactionType === 'register' && user.role !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can register gold' });
        }

        // Create a new transaction
        const newTransaction = new Transaction({
            userId,
            goldId,
            transactionTime: Date.now(), // Set the transaction time to the current date and time
            transactionType,
        });

        // Save the transaction to the database
        await newTransaction.save();

        res.status(201).json({ message: 'Transaction added successfully', transaction: newTransaction });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Route to get all transactions for the user
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Extract user information from the JWT token
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Fetch all transactions for the user
        const transactions = await Transaction.find({ userId });

        res.json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;