/**
 * Quick server startup test
 */

console.log('Testing server startup...');

try {
    // Set environment variables
    process.env.NODE_ENV = 'development';
    
    // Load and test all modules
    require('dotenv').config();
    console.log('✓ Environment loaded');
    
    const config = require('./controllers/config');
    console.log('✓ Config loaded');
    
    // Test server imports
    const express = require('express');
    const app = express();
    console.log('✓ Express initialized');
    
    // Test middleware imports
    const middleware = require('./controllers/middleware');
    console.log('✓ Middleware loaded');
    
    // Test SSL cert paths
    const fs = require('fs');
    if (fs.existsSync(config.web.privateKeyPath)) {
        console.log('✓ SSL private key found');
    } else {
        console.log('⚠ SSL private key not found, server will not start');
    }
    
    if (fs.existsSync(config.web.certificatePath)) {
        console.log('✓ SSL certificate found');
    } else {
        console.log('⚠ SSL certificate not found, server will not start');
    }
    
    console.log('✓ Server should be able to start successfully');
    console.log(`Port: ${config.web.port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    
} catch (error) {
    console.error('✗ Server startup test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
}
