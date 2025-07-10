/**
 * HTTP client module using axios
 * Replaces the deprecated request library
 * Created as part of Git-Captain modernization - 7/10/25
 */

const axios = require('axios');
const logger = require('./logger');

/**
 * Makes HTTP requests to GitHub API
 * @param {Object} options - Request options
 * @param {string} token - GitHub token (optional)
 * @returns {Promise<Object>} Response object
 */
async function makeGitHubRequest(options, token = null) {
    try {
        const config = {
            method: options.method || 'GET',
            url: options.url,
            headers: {
                'User-Agent': 'Git-Captain',
                'Accept': 'application/vnd.github.v3+json',
                ...options.headers
            },
            timeout: 30000,
            validateStatus: function (status) {
                return status < 500; // Accept all status codes less than 500
            }
        };

        // Add authorization header if token is provided
        if (token) {
            // Handle token format - clean up if it contains extra parameters
            let cleanToken = token;
            if (token.includes('access_token=')) {
                cleanToken = token.replace('access_token=', '').replace(/&.*$/, '');
            }
            config.headers['Authorization'] = `token ${cleanToken}`;
        }

        if (options.body) {
            config.data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
            config.headers['Content-Type'] = 'application/json';
        }

        if (options.auth) {
            config.auth = options.auth;
        }

        const response = await axios(config);
        
        return {
            statusCode: response.status,
            body: JSON.stringify(response.data),
            headers: response.headers
        };
    } catch (error) {
        logger.error('GitHub API request failed', {
            url: options.url,
            method: options.method,
            error: error.message,
            status: error.response?.status,
            data: error.response?.data
        });

        if (error.response) {
            return {
                statusCode: error.response.status,
                body: JSON.stringify(error.response.data),
                headers: error.response.headers
            };
        }

        throw error;
    }
}

/**
 * Makes OAuth requests to GitHub
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response object
 */
async function makeGitHubOAuthRequest(options) {
    try {
        const config = {
            method: options.method || 'GET',
            url: options.url,
            headers: {
                'User-Agent': 'Git-Captain',
                'Accept': 'application/json',
                ...options.headers
            },
            timeout: 30000,
            validateStatus: function (status) {
                return status < 500; // Accept all status codes less than 500
            }
        };

        if (options.auth) {
            config.auth = options.auth;
        }

        if (options.body) {
            config.data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
            config.headers['Content-Type'] = 'application/json';
        }

        const response = await axios(config);
        
        return {
            statusCode: response.status,
            body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
            headers: response.headers
        };
    } catch (error) {
        logger.error('GitHub OAuth request failed', {
            url: options.url,
            method: options.method,
            error: error.message,
            status: error.response?.status
        });

        if (error.response) {
            return {
                statusCode: error.response.status,
                body: typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data),
                headers: error.response.headers
            };
        }

        throw error;
    }
}

/**
 * Makes general HTTP requests
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response object
 */
async function makeHttpRequest(options) {
    try {
        const config = {
            method: options.method || 'GET',
            url: options.url,
            headers: {
                'User-Agent': 'Git-Captain',
                ...options.headers
            },
            timeout: 30000,
            validateStatus: function (status) {
                return status < 500; // Accept all status codes less than 500
            }
        };

        if (options.body) {
            config.data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
            config.headers['Content-Type'] = 'application/json';
        }

        const response = await axios(config);
        
        return {
            statusCode: response.status,
            body: JSON.stringify(response.data),
            headers: response.headers
        };
    } catch (error) {
        logger.error('HTTP request failed', {
            url: options.url,
            method: options.method,
            error: error.message,
            status: error.response?.status
        });

        if (error.response) {
            return {
                statusCode: error.response.status,
                body: JSON.stringify(error.response.data),
                headers: error.response.headers
            };
        }

        throw error;
    }
}

module.exports = {
    makeGitHubRequest,
    makeGitHubOAuthRequest,
    makeHttpRequest
};
