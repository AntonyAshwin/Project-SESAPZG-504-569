const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary
const Transaction = require('../models/Transaction'); // Adjust the path as necessary
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to protect routes

// Route to create a new transaction
router.post('/', authMiddleware, async (req, res) => {
    const { goldId, transactionType, transactionHash, recipientPublicKey } = req.body;

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

        // Update the user's goldAssets array
        if (transactionType === 'register') {
            user.goldAssets.push(goldId);
            await user.save();
        } else if (transactionType === 'transfer') {
            // Remove goldId from the current user's goldAssets array using $pull
            await User.updateOne({ _id: userId }, { $pull: { goldAssets: goldId } });

            // Find the recipient user by public key and add the goldId to their goldAssets array
            const recipientUser = await User.findOne({ publicKey: recipientPublicKey });
            if (!recipientUser) {
                return res.status(404).json({ message: 'Recipient user not found' });
            }
            recipientUser.goldAssets.push(goldId);
            await recipientUser.save();
        }

        res.status(201).json({ message: 'Transaction created successfully' });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Route to get transactions with filters, sorting, and pagination
router.get('/', authMiddleware, async (req, res) => {
    const { page = 1, orderBy = 'transactionTime', direction = 'desc', filterBy = '' } = req.query;
    const limit = 10; // Number of transactions per page

    try {
        // Extract user information from the JWT token
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Build the query object
        const query = { userId };
        if (filterBy) {
            query.transactionType = filterBy;
        }

        // Fetch transactions from the database with filters, sorting, and pagination
        const transactions = await Transaction.find(query)
            .sort({ [orderBy]: direction === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Get the total number of transactions for pagination
        const totalTransactions = await Transaction.countDocuments(query);
        const totalPages = Math.ceil(totalTransactions / limit);

        res.status(200).json({
            transactions,
            pagination: {
                totalTransactions,
                totalPages,
                currentPage: page,
            },
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;