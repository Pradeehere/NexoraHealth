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

// Permissive CORS for deployment troubleshooting
app.use(cors({
    origin: (origin, callback) => {
        // Reflect the request origin back to allow it (works with credentials)
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Log incoming requests for debugging Render connection
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});



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
