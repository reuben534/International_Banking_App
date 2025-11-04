const { check, validationResult } = require('express-validator');

const validateEmployee = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required')
        .trim()
        .escape(),
    check('email')
        .isEmail()
        .withMessage('Please include a valid email')
        .normalizeEmail(),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = { validateEmployee };
