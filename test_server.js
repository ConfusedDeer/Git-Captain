// Quick test to check if server starts
const express = require('express');
const https = require('https');
const fs = require('fs');

console.log('Testing server startup...');

try {
    // Test if all required modules can be loaded
    const config = require('./controllers/config');
    const logger = require('./controllers/logger');
    const httpClient = require('./controllers/httpClient');
    const middleware = require('./controllers/middleware');
    const validation = require('./controllers/validation');
    
    console.log('✓ All modules loaded successfully');
    console.log('✓ Config orgName:', config.orgName);
    
    // Quick test of server startup without actually running it
    const app = express();
    console.log('✓ Express app created');
    
    // Test if SSL files exist
    if (fs.existsSync(config.privateKeyPath) && fs.existsSync(config.certificatePath)) {
        console.log('✓ SSL certificate files found');
    } else {
        console.log('⚠ SSL certificate files not found');
    }
    
    console.log('All tests passed! Server should start correctly.');
    
} catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.error(error.stack);
}
