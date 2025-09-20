const express = require('express');
const { createPayment, getPayments, getCustomerPayments, updatePaymentToVerified, updatePaymentToSubmittedToSWIFT } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');
const { createPaymentValidation } = require('../utils/validation/paymentValidation');

const router = express.Router();

router.route('/').post(protect, createPaymentValidation, createPayment).get(protect, admin, getPayments);
router.route('/my').get(protect, getCustomerPayments);
router.route('/:id/verify').put(protect, admin, updatePaymentToVerified);
router.route('/:id/submit').put(protect, admin, updatePaymentToSubmittedToSWIFT);

module.exports = router;
