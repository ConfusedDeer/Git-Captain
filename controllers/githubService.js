/**
 * GitHub API Service Layer
 * Handles all GitHub API interactions with proper error handling and rate limiting
 * @author Joe Tavarez
 * @version 2.0.0
 */

const request = require('request');
const logger = require('./logger');
const { sanitizeToken, validateRepoName, validateBranchName, RateLimiter } = require('./security');
const config = require('./config');

class GitHubAPIService {
    constructor() {
        this.baseURL = config.gitHub.gitHubAPIendpoint;
        this.rateLimiter = new RateLimiter(config.security.rateLimitMax);
        this.defaultHeaders = {
            'User-Agent': 'Git-Captain/2.0.0',
            'Accept': 'application/vnd.github.v3+json'
        };
    }

    /**
     * Makes authenticated request to GitHub API
     * @param {Object} options - Request options
     * @param {string} token - GitHub access token
     * @returns {Promise} - Promise resolving to API response
     */
    async makeRequest(options, token) {
        return new Promise((resolve, reject) => {
            // Rate limiting check
            if (!this.rateLimiter.canMakeRequest()) {
                logger.warn('Rate limit exceeded, delaying request');
                return reject(new Error('Rate limit exceeded'));
            }

            // Sanitize token
            const cleanToken = sanitizeToken(token);
            
            // Build request options
            const requestOptions = {
                ...options,
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                    'Authorization': `token ${cleanToken}`
                }
            };

            // Record request for rate limiting
            this.rateLimiter.recordRequest();

            // Log request
            logger.debug('Making GitHub API request', {
                method: options.method,
                url: options.url,
                timestamp: new Date().toISOString()
            });

            // Make request
            request(requestOptions, (error, response, body) => {
                if (error) {
                    logger.error('GitHub API request failed', {
                        error: error.message,
                        url: options.url,
                        method: options.method
                    });
                    return reject(error);
                }

                // Log response
                logger.debug('GitHub API response received', {
                    statusCode: response.statusCode,
                    url: options.url,
                    method: options.method
                });

                resolve({
                    statusCode: response.statusCode,
                    body: body,
                    headers: response.headers
                });
            });
        });
    }

    /**
     * Get user repositories
     * @param {string} token - GitHub access token
     * @returns {Promise} - Promise resolving to repositories list
     */
    async getUserRepos(token) {
        const options = {
            method: 'GET',
            url: `${this.baseURL}/user/repos`,
            qs: {
                per_page: 100,
                sort: 'updated'
            }
        };

        return this.makeRequest(options, token);
    }

    /**
     * Get user information
     * @param {string} token - GitHub access token
     * @returns {Promise} - Promise resolving to user information
     */
    async getUserInfo(token) {
        const options = {
            method: 'GET',
            url: `${this.baseURL}/user`
        };

        return this.makeRequest(options, token);
    }

    /**
     * Get branch information
     * @param {string} orgName - Organization name
     * @param {string} repoName - Repository name
     * @param {string} branchName - Branch name
     * @param {string} token - GitHub access token
     * @returns {Promise} - Promise resolving to branch information
     */
    async getBranch(orgName, repoName, branchName, token) {
        // Validate inputs
        if (!validateRepoName(repoName) || !validateBranchName(branchName)) {
            throw new Error('Invalid repository or branch name');
        }

        const options = {
            method: 'GET',
            url: `${this.baseURL}/repos/${orgName}/${repoName}/branches/${branchName}`
        };

        return this.makeRequest(options, token);
    }

    /**
     * Create new branch
     * @param {string} orgName - Organization name
     * @param {string} repoName - Repository name
     * @param {string} newBranchName - New branch name
     * @param {string} baseBranchName - Base branch name
     * @param {string} token - GitHub access token
     * @returns {Promise} - Promise resolving to creation result
     */
    async createBranch(orgName, repoName, newBranchName, baseBranchName, token) {
        // Validate inputs
        if (!validateRepoName(repoName) || !validateBranchName(newBranchName) || !validateBranchName(baseBranchName)) {
            throw new Error('Invalid repository or branch name');
        }

        try {
            // First, get the base branch to get the SHA
            const baseBranch = await this.getBranch(orgName, repoName, baseBranchName, token);
            
            if (baseBranch.statusCode !== 200) {
                throw new Error(`Base branch ${baseBranchName} not found`);
            }

            const baseBranchData = JSON.parse(baseBranch.body);
            const sha = baseBranchData.commit.sha;

            // Create new branch
            const options = {
                method: 'POST',
                url: `${this.baseURL}/repos/${orgName}/${repoName}/git/refs`,
                json: {
                    ref: `refs/heads/${newBranchName}`,
                    sha: sha
                }
            };

            return this.makeRequest(options, token);
        } catch (error) {
            logger.error('Failed to create branch', {
                orgName,
                repoName,
                newBranchName,
                baseBranchName,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Delete branch
     * @param {string} orgName - Organization name
     * @param {string} repoName - Repository name
     * @param {string} branchName - Branch name to delete
     * @param {string} token - GitHub access token
     * @returns {Promise} - Promise resolving to deletion result
     */
    async deleteBranch(orgName, repoName, branchName, token) {
        // Validate inputs
        if (!validateRepoName(repoName) || !validateBranchName(branchName)) {
            throw new Error('Invalid repository or branch name');
        }

        // Prevent deletion of protected branches
        if (['master', 'main', 'develop'].includes(branchName.toLowerCase())) {
            throw new Error('Cannot delete protected branch');
        }

        const options = {
            method: 'DELETE',
            url: `${this.baseURL}/repos/${orgName}/${repoName}/git/refs/heads/${branchName}`
        };

        return this.makeRequest(options, token);
    }

    /**
     * Get pull requests
     * @param {string} orgName - Organization name
     * @param {string} repoName - Repository name
     * @param {string} state - PR state ('open', 'closed', 'all')
     * @param {string} base - Base branch name
     * @param {string} token - GitHub access token
     * @returns {Promise} - Promise resolving to pull requests list
     */
    async getPullRequests(orgName, repoName, state, base, token) {
        // Validate inputs
        if (!validateRepoName(repoName)) {
            throw new Error('Invalid repository name');
        }

        const options = {
            method: 'GET',
            url: `${this.baseURL}/repos/${orgName}/${repoName}/pulls`,
            qs: {
                state: state || 'open',
                base: base,
                per_page: 100
            }
        };

        return this.makeRequest(options, token);
    }

    /**
     * Revoke OAuth token
     * @param {string} token - GitHub access token
     * @returns {Promise} - Promise resolving to revocation result
     */
    async revokeToken(token) {
        const cleanToken = sanitizeToken(token);
        
        const options = {
            method: 'DELETE',
            url: `${this.baseURL}/applications/${config.gitHub.client_id}/tokens/${cleanToken}`,
            auth: {
                user: config.gitHub.client_id,
                pass: config.gitHub.client_secret
            }
        };

        return this.makeRequest(options, token);
    }
}

module.exports = new GitHubAPIService();
