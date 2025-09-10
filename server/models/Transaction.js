const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    payeeAccount: {
        type: String,
        required: true,
    },
    swiftCode: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    isSubmittedToSWIFT: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
