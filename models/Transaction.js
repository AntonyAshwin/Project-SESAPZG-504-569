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
    transactionHash: {
        type: String,
        required: true,
        unique: true, // Ensure transactionHash is unique
    },
    isSuccessful: {
        type: Boolean,
        default: true, // Default to true if not specified
    },
});

TransactionSchema.index({ transactionHash: 1 }, { unique: true });

module.exports = mongoose.model('Transaction', TransactionSchema);