// Debug test for middleware loading
console.log('Testing middleware loading...');

try {
    const config = require('./config');
    console.log('Config loaded successfully');
    console.log('Config structure:', Object.keys(config));
    console.log('Security config:', config.security);
} catch (error) {
    console.error('Error loading config:', error.message);
}

try {
    console.log('Testing individual middleware components...');
    
    // Test individual imports
    console.log('Testing helmet...');
    const helmet = require('helmet');
    console.log('Helmet imported successfully');
    
    console.log('Testing cors...');
    const cors = require('cors');
    console.log('CORS imported successfully');
    
    console.log('Testing rate-limit...');
    const rateLimit = require('express-rate-limit');
    console.log('Rate limit imported successfully');
    
    console.log('Testing compression...');
    const compression = require('compression');
    console.log('Compression imported successfully');
    
    console.log('Testing morgan...');
    const morgan = require('morgan');
    console.log('Morgan imported successfully');
    
    console.log('Testing logger...');
    const logger = require('./logger');
    console.log('Logger imported successfully');
    
    console.log('Now testing full middleware...');
    const middleware = require('./middleware');
    console.log('Middleware loaded successfully');
    console.log('Middleware structure:', Object.keys(middleware));
    
    // Check if middleware functions exist
    if (middleware.helmet) console.log('helmet middleware exists');
    if (middleware.cors) console.log('cors middleware exists');
    if (middleware.compression) console.log('compression middleware exists');
    if (middleware.generalLimiter) console.log('generalLimiter middleware exists');
} catch (error) {
    console.error('Error loading middleware:', error.message);
    console.error('Stack:', error.stack);
}
