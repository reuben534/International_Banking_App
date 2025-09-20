const express = require('express');
const { registerUser, authUser } = require('../controllers/userController');
const { registerUserValidation, authUserValidation } = require('../utils/validation/userValidation');

const router = express.Router();

router.post(
    '/register',
    registerUserValidation,
    registerUser
);

router.post(
    '/login',
    authUserValidation,
    authUser
);

module.exports = router;
