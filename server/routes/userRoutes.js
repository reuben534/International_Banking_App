const express = require('express');
const { registerUser, authUser } = require('../controllers/userController');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('idNumber', 'ID Number is required').not().isEmpty(),
        check('idNumber', 'ID Number must be 13 digits').isLength({ min: 13, max: 13 }),
        check('accountNumber', 'Account Number is required').not().isEmpty(),
        check('accountNumber', 'Account Number must be 10 digits').isLength({ min: 10, max: 10 }),
        check('password', 'Password is required').not().isEmpty(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
        check('role', 'Role is required').not().isEmpty(),
    ],
    registerUser
);

router.post(
    '/login',
    [
        check('idNumber', 'ID Number is required').not().isEmpty(),
        check('accountNumber', 'Account Number is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
    ],
    authUser
);

module.exports = router;
