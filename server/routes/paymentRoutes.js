const express = require('express');
const { check } = require('express-validator');
const { createPayment, getPayments, getCustomerPayments, updatePaymentToVerified, updatePaymentToSubmittedToSWIFT } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, [
    check('amount', 'Amount must be a valid decimal number').matches(/^\d+(\.\d{1,2})?$/),
    check('currency', 'Currency must be a 3-letter uppercase code').matches(/^[A-Z]{3}$/),
    check('provider', 'Provider must be SWIFT').matches(/^SWIFT$/),
    check('payeeAccount', 'Payee account must be alphanumeric and at least 5 characters').matches(/^[a-zA-Z0-9]{5,}$/),
    check('swiftCode', 'SWIFT code must be a valid BIC code').isBIC(),
], createPayment).get(protect, admin, getPayments);
router.route('/my').get(protect, getCustomerPayments);
router.route('/:id/verify').put(protect, admin, updatePaymentToVerified);
router.route('/:id/submit').put(protect, admin, updatePaymentToSubmittedToSWIFT);

module.exports = router;
