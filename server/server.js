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

const allowedOrigins = ['http://localhost:3000', 'YOUR_PRODUCTION_FRONTEND_URL'];

app.use(helmet());
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
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
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
});
app.use('/api/users/login', loginLimiter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
