/**
 * Security Utilities Module
 * Provides security-related helper functions for Git-Captain
 * @author Joe Tavarez
 * @version 2.0.0
 */

/**
 * Sanitizes and validates OAuth token
 * @param {string} token - Raw OAuth token from GitHub
 * @returns {string} - Cleaned token or throws error
 */
function sanitizeToken(token) {
    if (!token || typeof token !== 'string') {
        throw new Error('Invalid token provided');
    }
    
    // Remove OAuth token formatting if present
    return token
        .replace(/^access_token=/, '')
        .replace(/&scope=repo&token_type=bearer$/, '')
        .trim();
}

/**
 * Validates GitHub repository name
 * @param {string} repoName - Repository name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateRepoName(repoName) {
    if (!repoName || typeof repoName !== 'string') {
        return false;
    }
    
    // GitHub repo name validation: alphanumeric, hyphens, underscores, dots
    const repoRegex = /^[a-zA-Z0-9._-]+$/;
    return repoRegex.test(repoName) && repoName.length <= 100;
}

/**
 * Validates branch name according to Git standards
 * @param {string} branchName - Branch name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateBranchName(branchName) {
    if (!branchName || typeof branchName !== 'string') {
        return false;
    }
    
    // Git branch name validation rules
    const invalidChars = /[~^:?*\[\]\\]/;
    const invalidPatterns = /^\/|\/\/|\/$/;
    
    return !invalidChars.test(branchName) && 
           !invalidPatterns.test(branchName) && 
           branchName.length <= 250;
}

/**
 * Rate limiting helper - tracks API calls per minute
 */
class RateLimiter {
    constructor(maxRequests = 60) {
        this.maxRequests = maxRequests;
        this.requests = [];
    }
    
    canMakeRequest() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Remove old requests
        this.requests = this.requests.filter(time => time > oneMinuteAgo);
        
        return this.requests.length < this.maxRequests;
    }
    
    recordRequest() {
        this.requests.push(Date.now());
    }
}

module.exports = {
    sanitizeToken,
    validateRepoName,
    validateBranchName,
    RateLimiter
};
