// Simple test to verify server is responding
const https = require('https');

// Create an agent that ignores SSL certificate errors
const agent = new https.Agent({
    rejectUnauthorized: false
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/gitCaptain/checkGitCaptainStatus',
    method: 'GET',
    agent: agent
};

const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Response:', data);
    });
});

req.on('error', (error) => {
    console.error('Error:', error.message);
});

req.end();
