const jwt = require('jsonwebtoken');

const generateToken = (res, id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 60 * 60 * 1000, // 1 hour
    });
};

module.exports = generateToken;
