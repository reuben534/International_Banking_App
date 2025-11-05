const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('@exortek/express-mongo-sanitize');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config();

connectDB();

const app = express();
app.set('trust proxy', 1);

// In production, you should set this to your client's URL
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'YOUR_PRODUCTION_URL' : 'http://localhost:3000',
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(mongoSanitize());
app.use(hpp());

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
app.use('/api/employees', employeeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

const https = require('node:https');
const fs = require('node:fs');

const options = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
};

https.createServer(options, app).listen(PORT);