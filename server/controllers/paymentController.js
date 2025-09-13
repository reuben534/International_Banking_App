const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency, provider, payeeAccount, swiftCode } = req.body;

    const transaction = new Transaction({
        user: req.user._id, // User ID will come from auth middleware
        amount,
        currency,
        provider,
        payeeAccount,
        swiftCode,
    });

    const createdTransaction = await transaction.save();
    res.status(201).json(createdTransaction);
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Employee
const getPayments = async (req, res) => {
    const payments = await Transaction.find({}).populate('user', 'name');
    res.json(payments);
};

// @desc    Get customer payments
// @route   GET /api/payments/my
// @access  Private/Customer
const getCustomerPayments = async (req, res) => {
    const payments = await Transaction.find({ user: req.user._id });
    res.json(payments);
};

// @desc    Update payment to verified
// @route   PUT /api/payments/:id/verify
// @access  Private/Employee
const updatePaymentToVerified = async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (transaction) {
        transaction.isVerified = true;
        transaction.status = 'Verified';

        const updatedTransaction = await transaction.save();
        res.json(updatedTransaction);
    } else {
        res.status(404).json({ message: 'Transaction not found' });
    }
};

// @desc    Update payment to submitted to SWIFT
// @route   PUT /api/payments/:id/submit
// @access  Private/Employee
const updatePaymentToSubmittedToSWIFT = async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (transaction) {
        transaction.isSubmittedToSWIFT = true;
        transaction.status = 'Submitted to SWIFT';

        const updatedTransaction = await transaction.save();
        res.json(updatedTransaction);
    } else {
        res.status(404).json({ message: 'Transaction not found' });
    }
};

module.exports = { createPayment, getPayments, getCustomerPayments, updatePaymentToVerified, updatePaymentToSubmittedToSWIFT };
