const User = require('../models/User');
const TokenBlocklist = require('../models/TokenBlocklist');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
 

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { idNumber, accountNumber, password } = req.body;

    const user = await User.findOne({ idNumber, accountNumber });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.json({
            _id: user._id,
            name: user.name,
            idNumber: user.idNumber,
            accountNumber: user.accountNumber,
            role: user.role,
        });
    } else {
        res.status(401).json({ message: 'INVALID_CREDENTIALS' });
    }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    const { jti, exp } = req.user;

    const token = new TokenBlocklist({
        jti,
        expiresAt: new Date(exp * 1000),
    });

    await token.save();

    res.clearCookie('jwt');

    res.json({ message: 'Logged out successfully' });
});

module.exports = { authUser, logoutUser };
