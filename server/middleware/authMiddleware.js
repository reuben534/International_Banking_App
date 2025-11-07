const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlocklist = require('../models/TokenBlocklist');

const protect = async (req, res, next) => {
    let token;

    if (req.cookies.jwt) {
        try {
            token = req.cookies.jwt;

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const blocked = await TokenBlocklist.findOne({ jti: decoded.jti });

            if (blocked) {
                return res.status(401).json({ message: 'Not authorized, token blocked' });
            }

            req.user = await User.findById(decoded.id).select('-password');
            req.user.jti = decoded.jti;
            req.user.exp = decoded.exp;

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user?.role === 'employee') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };

