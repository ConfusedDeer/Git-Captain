/**
 * Test script to verify all modules can be imported
 */

console.log('Testing module imports...');

try {
    require('dotenv').config();
    console.log('✓ dotenv loaded');
    
    const config = require('./controllers/config');
    console.log('✓ config loaded');
    
    const httpClient = require('./controllers/httpClient');
    console.log('✓ httpClient loaded');
    
    const validation = require('./controllers/validation');
    console.log('✓ validation loaded');
    
    const middleware = require('./controllers/middleware');
    console.log('✓ middleware loaded');
    
    const express = require('express');
    console.log('✓ express loaded');
    
    console.log('✓ All modules loaded successfully!');
    
} catch (error) {
    console.error('✗ Error loading modules:', error.message);
    console.error('Stack:', error.stack);
}
