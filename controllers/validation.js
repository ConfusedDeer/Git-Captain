/**
 * Input validation middleware using express-validator
 * Created as part of Git-Captain modernization - 7/10/25
 */

const { body, query, validationResult } = require('express-validator');

const validation = {
    // Validation for URL parameters
    params: [
        // No specific validation needed for params, just ensure they exist
    ],

    // Validation for OAuth code
    oauthCode: [
        query('code').notEmpty().withMessage('Authorization code is required')
    ],

    // Validation for creating branches
    createBranch: [
        body('repo').notEmpty().withMessage('Repository name is required'),
        body('newBranch').notEmpty().withMessage('New branch name is required'),
        body('branchRef').notEmpty().withMessage('Source branch name is required'),
        body('token').notEmpty().withMessage('GitHub token is required')
    ],

    // Validation for searching branches
    searchBranch: [
        body('repo').notEmpty().withMessage('Repository name is required'),
        body('searchForBranch').notEmpty().withMessage('Branch name to search is required'),
        body('token').notEmpty().withMessage('GitHub token is required')
    ],

    // Validation for searching pull requests
    searchPR: [
        body('repo').notEmpty().withMessage('Repository name is required'),
        body('state').notEmpty().withMessage('PR state is required'),
        body('prBaseBranch').notEmpty().withMessage('Base branch is required'),
        body('token').notEmpty().withMessage('GitHub token is required')
    ],

    // Validation for logout
    logOff: [
        body('token').notEmpty().withMessage('GitHub token is required')
    ],

    // Validation for repository search
    searchRepos: [
        body('token').notEmpty().withMessage('GitHub token is required')
    ],

    // Validation for deleting branches
    deleteBranch: [
        body('repo').notEmpty().withMessage('Repository name is required'),
        body('deleteBranch').notEmpty().withMessage('Branch name to delete is required'),
        body('token').notEmpty().withMessage('GitHub token is required')
    ]
};

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            message: 'Invalid input data',
            details: errors.array()
        });
    }
    next();
};

module.exports = {
    validation,
    handleValidationErrors
};
