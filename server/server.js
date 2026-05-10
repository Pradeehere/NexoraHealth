// Polyfill global crypto for packages that expect it (e.g. dotenv v17, bcryptjs v3, express-rate-limit v8)
if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = require('crypto');
}

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Connect to Database
connectDB();

// Security Middlewares
app.use(helmet());

const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean);

// Add variants with/without trailing slashes
const finalOrigins = allowedOrigins.flatMap(origin => [
    origin,
    origin.endsWith('/') ? origin.slice(0, -1) : `${origin}/`
]);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || finalOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
app.use('/api/', apiLimiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
});
app.use('/api/auth/', authLimiter);

// Express Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Nexora Health Server running on port ${PORT}`);
});
