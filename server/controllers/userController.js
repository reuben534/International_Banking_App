const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, idNumber, accountNumber, password, role } = req.body;

    const userExists = await User.findOne({ idNumber });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        idNumber,
        accountNumber,
        password,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            idNumber: user.idNumber,
            accountNumber: user.accountNumber,
            role: user.role,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { idNumber, accountNumber, password } = req.body;

    const user = await User.findOne({ idNumber, accountNumber });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            idNumber: user.idNumber,
            accountNumber: user.accountNumber,
            role: user.role,
        });
    } else {
        res.status(401).json({ message: 'Invalid ID number, account number or password' });
    }
};

module.exports = { registerUser, authUser };
