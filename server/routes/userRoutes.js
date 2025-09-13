const express = require('express');
const { registerUser, authUser } = require('../controllers/userController');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.post(
    '/register',
    [
        check('name', 'Name must be alphabetic').matches(/^[a-zA-Z ]+$/),
        check('idNumber', 'ID Number must be 13 digits').matches(/^\d{13}$/),
        check('accountNumber', 'Account Number must be 10 digits').matches(/^\d{10}$/),
        check('password', 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        check('role', 'Role must be either customer or employee').matches(/^(customer|employee)$/),
    ],
    registerUser
);

router.post(
    '/login',
    [
        check('idNumber', 'ID Number must be 13 digits').matches(/^\d{13}$/),
        check('accountNumber', 'Account Number must be 10 digits').matches(/^\d{10}$/),
        check('password', 'Password is required').not().isEmpty(),
    ],
    authUser
);

module.exports = router;
