/**
 * Simple test to check if the server can start
 */

console.log('Starting test...');

try {
    require('dotenv').config();
    console.log('✓ dotenv loaded');
    
    const config = require('./controllers/config');
    console.log('✓ config loaded');
    
    const fs = require('fs');
    
    // Check if SSL certificates exist
    if (fs.existsSync(config.web.privateKeyPath)) {
        console.log('✓ Private key found');
    } else {
        console.log('✗ Private key not found at:', config.web.privateKeyPath);
    }
    
    if (fs.existsSync(config.web.certificatePath)) {
        console.log('✓ Certificate found');
    } else {
        console.log('✗ Certificate not found at:', config.web.certificatePath);
    }
    
    console.log('Port:', config.web.port);
    console.log('GitHub Client ID:', config.gitHub.client_id);
    console.log('Environment:', process.env.NODE_ENV);
    
    console.log('✓ All checks passed');
    
} catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Stack:', error.stack);
}
