const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to protect routes

// Route to add a new transaction
router.post('/', authMiddleware, async (req, res) => {
    const { goldId } = req.body;

    // Validate input
    if (!goldId) {
        return res.status(400).json({ message: 'Gold ID is required' });
    }

    try {
        // Extract user information from the JWT token
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Create a new transaction
        const newTransaction = new Transaction({
            userId,
            goldId,
            transactionTime: Date.now(), // Set the transaction time to the current date and time
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

        // Log the userId for debugging
        console.log(`Fetching transactions for user: ${userId}`);

        // Fetch all transactions for the user
        const transactions = await Transaction.find({ userId });

        // Log the transactions for debugging
        console.log(`Transactions found: ${JSON.stringify(transactions)}`);

        res.json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;