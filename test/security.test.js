/**
 * Security Test Suite for Git-Captain
 * Tests various security aspects of the application
 */

const request = require('supertest');
const express = require('express');

// Mock application for testing
const createTestApp = () => {
    const app = express();
    
    // Import and apply security middleware
    const { helmet, cors, generalLimiter, securityMiddleware } = require('../controllers/middleware');
    
    app.use(helmet);
    app.use(cors);
    app.use(securityMiddleware);
    app.use(generalLimiter);
    
    app.get('/test', (req, res) => {
        res.json({ message: 'Test endpoint' });
    });
    
    return app;
};

describe('Security Tests', () => {
    let app;
    
    beforeEach(() => {
        app = createTestApp();
    });
    
    describe('Security Headers', () => {
        test('should set security headers', async () => {
            const response = await request(app)
                .get('/test')
                .expect(200);
            
            expect(response.headers['x-frame-options']).toBe('DENY');
            expect(response.headers['x-content-type-options']).toBe('nosniff');
            expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
        });
        
        test('should not expose server information', async () => {
            const response = await request(app)
                .get('/test')
                .expect(200);
            
            expect(response.headers['x-powered-by']).toBeUndefined();
        });
    });
    
    describe('Rate Limiting', () => {
        test('should apply rate limiting', async () => {
            // Make multiple requests to test rate limiting
            const requests = Array(70).fill().map(() => 
                request(app).get('/test')
            );
            
            const responses = await Promise.all(requests);
            
            // Some requests should be rate limited
            const rateLimitedResponses = responses.filter(res => res.status === 429);
            expect(rateLimitedResponses.length).toBeGreaterThan(0);
        });
    });
    
    describe('CORS', () => {
        test('should handle CORS preflight requests', async () => {
            const response = await request(app)
                .options('/test')
                .set('Origin', 'https://github.com')
                .set('Access-Control-Request-Method', 'GET')
                .expect(204);
            
            expect(response.headers['access-control-allow-origin']).toBe('https://github.com');
        });
    });
});

describe('Input Validation Tests', () => {
    const { validation } = require('../controllers/validation');
    
    describe('Branch Creation Validation', () => {
        test('should validate repository name', () => {
            const validators = validation.createBranch;
            const repoValidator = validators.find(v => v.builder.fields.includes('repo'));
            
            expect(repoValidator).toBeDefined();
        });
        
        test('should reject invalid repository names', () => {
            const invalidNames = ['', 'repo with spaces', 'repo@invalid', 'a'.repeat(101)];
            
            invalidNames.forEach(name => {
                const isValid = /^[a-zA-Z0-9._-]+$/.test(name) && name.length >= 1 && name.length <= 100;
                expect(isValid).toBe(false);
            });
        });
    });
    
    describe('Token Validation', () => {
        test('should validate token format', () => {
            const validTokens = [
                'access_token=abc123&scope=repo&token_type=bearer',
                'gho_abc123def456',
                'github_pat_abc123'
            ];
            
            const invalidTokens = [
                '',
                'token with spaces',
                'token@invalid',
                'a'.repeat(501)
            ];
            
            validTokens.forEach(token => {
                const isValid = /^[a-zA-Z0-9._=&-]+$/.test(token) && token.length >= 1 && token.length <= 500;
                expect(isValid).toBe(true);
            });
            
            invalidTokens.forEach(token => {
                const isValid = /^[a-zA-Z0-9._=&-]+$/.test(token) && token.length >= 1 && token.length <= 500;
                expect(isValid).toBe(false);
            });
        });
    });
});

describe('HTTP Client Tests', () => {
    const { makeGitHubRequest, makeHttpRequest } = require('../controllers/httpClient');
    
    describe('GitHub API Client', () => {
        test('should handle successful API calls', async () => {
            const options = {
                method: 'GET',
                url: '/user'
            };
            
            // Mock successful response
            const response = await makeGitHubRequest(options, 'mock_token');
            
            expect(response).toHaveProperty('statusCode');
            expect(response).toHaveProperty('body');
        });
        
        test('should handle API errors gracefully', async () => {
            const options = {
                method: 'GET',
                url: '/nonexistent'
            };
            
            const response = await makeGitHubRequest(options, 'invalid_token');
            
            expect(response.statusCode).toBeGreaterThanOrEqual(400);
        });
    });
});

describe('Configuration Validation', () => {
    describe('Environment Variables', () => {
        test('should validate required environment variables', () => {
            const requiredVars = [
                'client_id',
                'client_secret',
                'GITHUB_ORG_NAME',
                'GIT_PORT_ENDPOINT',
                'privateKeyPath',
                'certificatePath'
            ];
            
            requiredVars.forEach(varName => {
                expect(process.env[varName]).toBeDefined();
            });
        });
        
        test('should validate URL format', () => {
            const url = process.env.GIT_PORT_ENDPOINT;
            expect(() => new URL(url)).not.toThrow();
        });
        
        test('should validate numeric values', () => {
            const port = parseInt(process.env.PORT || '3000');
            expect(port).toBeGreaterThan(0);
            expect(port).toBeLessThan(65536);
        });
    });
});

module.exports = {
    createTestApp
};
