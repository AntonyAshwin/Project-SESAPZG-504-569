const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    goldId: {
        type: String,
        required: true,
    },
    transactionTime: {
        type: Date,
        default: Date.now, // Automatically set to the current date and time when a transaction is created
    },
    transactionType: {
        type: String,
        required: true,
        enum: ['register', 'transfer'], // Specify the allowed transaction types
    },
    recipientPublicKey: {
        type: String,
        required: function() {
            return this.transactionType === 'transfer';
        },
    },
});

module.exports = mongoose.model('Transaction', TransactionSchema);