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
    max: 500, // Increase from 100 to 500
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Increase from 10 to 50
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Too many login attempts. Please wait a few minutes and try again.'
    },
    skip: (req) => {
        // Skip rate limiting in development
        return process.env.NODE_ENV === 'development';
    }
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
app.use('/api/air-quality', require('./routes/airQualityRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));

app.get('/api/air-quality-test', async (req, res) => {
    const axios = require('axios');
    try {
        const response = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=12.9716&longitude=77.5946&current=european_aqi,pm2_5,pm10&timezone=auto', { timeout: 8000 });
        res.json({ success: true, data: response.data });
    } catch (e) {
        res.json({ success: false, error: e.message });
    }
});

// Production Seeding Route - Visit this to setup Atlas DB
app.get('/api/init-db', async (req, res) => {
    try {
        const { importData } = require('./seed/seedDataModular');
        await importData();
        res.status(200).json({ message: 'Production Database Init Successful (Pradeep S user created)' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Nexora Health Server running on port ${PORT}`);
});
