#!/usr/bin/env node

/**
 * Git-Captain Setup Script
 * Helps users configure their environment variables
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
    console.log('🚢 Git-Captain Setup');
    console.log('=====================');
    console.log('This script will help you configure your Git-Captain environment.\n');

    const config = {};

    // GitHub OAuth Configuration
    console.log('📋 GitHub OAuth Configuration');
    console.log('You need to create a GitHub OAuth App first.');
    console.log('Visit: https://github.com/settings/developers\n');
    
    config.client_id = await question('GitHub Client ID: ');
    config.client_secret = await question('GitHub Client Secret: ');
    config.GITHUB_ORG_NAME = await question('GitHub Organization/Username: ');

    // Server Configuration
    console.log('\n🌐 Server Configuration');
    config.GIT_PORT_ENDPOINT = await question('Server URL (e.g., https://your-server.com): ');
    
    const port = await question('Port (default: 3000): ');
    config.PORT = port || '3000';

    // SSL Certificates
    console.log('\n🔐 SSL Certificate Configuration');
    config.privateKeyPath = await question('Private Key Path (default: ./controllers/theKey.key): ') || './controllers/theKey.key';
    config.certificatePath = await question('Certificate Path (default: ./controllers/theCert.cert): ') || './controllers/theCert.cert';

    // Optional Settings
    console.log('\n⚙️ Optional Settings (press Enter for defaults)');
    config.TIMEOUT_MINUTES = await question('Session timeout in minutes (default: 25): ') || '25';
    config.NODE_ENV = await question('Environment (development/production, default: development): ') || 'development';

    // Generate .env file
    const envContent = Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const envPath = path.join(__dirname, '..', '.env');
    
    try {
        // Check if .env already exists
        if (fs.existsSync(envPath)) {
            const overwrite = await question('\n.env file already exists. Overwrite? (y/N): ');
            if (overwrite.toLowerCase() !== 'y') {
                console.log('Setup cancelled. Existing .env file preserved.');
                rl.close();
                return;
            }
        }
        
        fs.writeFileSync(envPath, envContent);
        console.log('\n✅ Configuration saved to .env file');
        console.log('🚀 You can now start Git-Captain with: npm start');
        
        // Check if certificates exist
        if (!fs.existsSync(config.privateKeyPath) || !fs.existsSync(config.certificatePath)) {
            console.log('\n⚠️  Warning: SSL certificate files not found.');
            console.log('Make sure to place your SSL certificates in the specified paths.');
        }
        
    } catch (error) {
        console.error('❌ Failed to save configuration:', error.message);
        process.exit(1);
    }

    rl.close();
}

setup().catch(error => {
    console.error('Setup failed:', error.message);
    process.exit(1);
});
