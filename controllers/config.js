/**
 * Created by JoeTavarez on 10/25/18.
 * Updated with security configuration - 7/10/25
 */

var config = {};
config.gitHub = {};
config.web = {};
config.security = {};

config.gitHub.gitHubAPIendpoint = 'https://api.github.com';
config.gitHub.gitHubEndPoint = 'https://github.com';

config.gitHub.client_id = process.env.client_id; //from .env file
config.gitHub.client_secret = process.env.client_secret; //from .env file

config.gitHub.orgName = process.env.GITHUB_ORG_NAME; //Taken from github for example: https://github.com/[this] which can be your organization or username

config.web.port = process.env.PORT || 3000;
config.web.gitCaptainStatus = 'up'; 
config.web.gitCaptainReason = 'Service is operational'; 
config.web.gitCaptainTimeOutInMinutes = 25;
config.web.gitPortEndPoint = process.env.GIT_PORT_ENDPOINT || 'https://localhost:3000';

config.web.privateKeyPath = process.env.privateKeyPath;
config.web.certificatePath = process.env.certificatePath;

// Security configuration
config.security.rateLimitWindow = 60000; // 1 minute
config.security.rateLimitMax = 600; // Production-friendly rate limit
config.security.sessionTimeout = 1800000; // 30 minutes

// Application configuration
config.app = {};
config.app.nodeEnv = 'development';

module.exports = config;

Object.freeze(config);
Object.freeze(config.gitHub);
Object.freeze(config.web);
Object.freeze(config.security);
Object.freeze(config.app);