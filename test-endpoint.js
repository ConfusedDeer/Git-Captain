/**
 * Quick test script to verify server endpoints
 */

const https = require('https');
const fs = require('fs');

// Load the config to get the port
require('dotenv').config();
const config = require('./controllers/config');

const port = config.web.port;

// Test the endpoint
const options = {
    hostname: 'localhost',
    port: port,
    path: '/api/v1/gitCaptain/checkGitCaptainStatus',
    method: 'GET',
    // Accept self-signed certificates for testing
    rejectUnauthorized: false
};

console.log(`Testing endpoint: https://localhost:${port}/api/v1/gitCaptain/checkGitCaptainStatus`);

const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Response body:', data);
    });
});

req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
});

req.end();
