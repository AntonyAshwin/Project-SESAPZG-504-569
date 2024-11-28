const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to protect routes

// Route to add a new transaction
router.post('/', authMiddleware, async (req, res) => {
    const { goldId, transactionType, recipientPublicKey, transactionHash } = req.body;

    // Validate input
    if (!goldId || !transactionType || !transactionHash) {
        return res.status(400).json({ message: 'Gold ID, transaction type, and transaction hash are required' });
    }

    if (!['register', 'transfer'].includes(transactionType)) {
        return res.status(400).json({ message: 'Invalid transaction type' });
    }

    if (transactionType === 'transfer' && !recipientPublicKey) {
        return res.status(400).json({ message: 'Recipient public key is required for transfer transactions' });
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
            recipientPublicKey: transactionType === 'transfer' ? recipientPublicKey : undefined,
            transactionHash,
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Transaction hash must be unique' });
        }
        res.status(500).json({ error: 'Failed to create transaction' });
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
        
        // **Pagination logic** - Extract 'page' and 'limit' from query parameters
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        // Fetch paginated transactions for the user
        const transactions = await Transaction.find({ userId })
            .sort({ transactionTime: -1 }) // Sort by most recent transaction
            .skip(skip) // Skip documents for previous pages
            .limit(limit); // Limit the number of results to 'limit'

        // Fetch total count for pagination metadata
        const totalTransactions = await Transaction.countDocuments({ userId });

        // **Return paginated results and metadata**
        res.json({
            transactions,
            pagination: {
                total: totalTransactions,
                page,
                limit,
                totalPages: Math.ceil(totalTransactions / limit),
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
