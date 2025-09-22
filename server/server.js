const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

connectDB();

const app = express();
app.set('trust proxy', 1);

// In a production environment, you should be more restrictive with your CORS policy.
// For example, you might want to do something like this:
const allowedOrigins = new Set(['http://localhost:3000', 'YOUR_PRODUCTION_FRONTEND_URL']); // REMEMBER TO UPDATE 'YOUR_PRODUCTION_FRONTEND_URL'
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(helmet());
app.use(express.json());

// Rate limiting for all API requests
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', apiLimiter);

// Stricter rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 1 minute',
});
app.use('/api/users/login', loginLimiter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

const https = require('node:https');
const fs = require('node:fs');

const options = {
    key: fs.readFileSync(__dirname + '/key.pem'),
    cert: fs.readFileSync(__dirname + '/cert.pem'),
};

https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});