// Test middleware loading
try {
    console.log('Loading config...');
    const config = require('./config');
    console.log('Config loaded successfully');
    console.log('Config object keys:', Object.keys(config));
    
    console.log('Loading middleware...');
    const middleware = require('./middleware');
    console.log('Middleware loaded successfully');
    console.log('Middleware object keys:', Object.keys(middleware));
    
    console.log('Test completed successfully');
} catch (error) {
    console.error('Error occurred:', error.message);
    console.error('Stack:', error.stack);
}
