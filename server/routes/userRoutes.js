const express = require('express');
const { authUser, logoutUser } = require('../controllers/userController');
const { authUserValidation } = require('../utils/validation/userValidation');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

 

router.post(
    '/login',
    authUserValidation,
    authUser
);

router.post('/logout', protect, logoutUser);

module.exports = router;
