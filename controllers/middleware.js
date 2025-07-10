/**
 * Security middleware configuration
 * Implements security best practices for the application
 */

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const config = require('./config');
const logger = require('./logger');

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs: windowMs,
        max: max,
        message: {
            error: message,
            statusCode: 429
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            logger.warn('Rate limit exceeded', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                url: req.url,
                method: req.method
            });
            res.status(429).json({
                error: message,
                statusCode: 429,
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
    });
};

// General rate limiter - more permissive for development
const generalLimiter = createRateLimiter(
    config.security.rateLimitWindow || 60000, // 1 minute
    config.security.rateLimitMax || 200, // 200 requests per minute (increased from 60)
    'Too many requests from this IP, please try again later'
);

// Strict rate limiter for sensitive operations
const strictLimiter = createRateLimiter(
    300000, // 5 minutes
    25, // 25 requests per 5 minutes (increased from 10)
    'Too many sensitive operations from this IP, please try again later'
);

// Auth rate limiter - more permissive for development/testing
const authLimiter = createRateLimiter(
    300000, // 5 minutes
    300, // 300 attempts per 5 minutes (increased for development)
    'Too many authentication attempts from this IP, please try again later'
);

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            config.web.gitPortEndPoint,
            'https://github.com',
            'https://api.github.com',
            'https://status.github.com'
        ];
        
        // In development, allow localhost
        if (process.env.NODE_ENV === 'development') {
            allowedOrigins.push('http://localhost:3000', 'https://localhost:3000');
        }
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn('CORS violation', { origin, ip: origin });
            callback(null, true); // Allow for now, but log the violation
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 24 hours
};

// Helmet configuration for security headers
const helmetOptions = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://api.github.com'],
            scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'https://api.github.com', 'https://github.com', 'https://status.github.com'],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false, // Disable for GitHub API compatibility
    hsts: process.env.NODE_ENV === 'production' ? {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    } : false // Disable HSTS in development
};

// Custom security middleware
const securityMiddleware = (req, res, next) => {
    // Remove server information
    res.removeHeader('X-Powered-By');
    
    // Add custom security headers
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Log security-relevant requests
    if (req.method !== 'GET' || req.url.includes('/api/')) {
        logger.info('Security-relevant request', {
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
    }
    
    next();
};

// Request logging middleware
const requestLogger = morgan('combined', {
    stream: {
        write: (message) => {
            logger.info(message.trim());
        }
    }
});

module.exports = {
    helmet: helmet(helmetOptions),
    cors: cors(corsOptions),
    compression: compression(),
    generalLimiter,
    strictLimiter,
    authLimiter,
    securityMiddleware,
    requestLogger
};

console.log('Middleware module exports created successfully');
