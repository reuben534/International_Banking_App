const mongoose = require('mongoose');

const TokenBlocklistSchema = new mongoose.Schema({
    jti: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
    },
});

const TokenBlocklist = mongoose.model('TokenBlocklist', TokenBlocklistSchema);

module.exports = TokenBlocklist;
