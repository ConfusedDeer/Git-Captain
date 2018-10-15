/**
 * Created by JoeTavarez on 10/25/18.
 */


var config = {};
config.gitHub = {};
config.web = {};

config.gitHub.gitHubAPIendpoint = 'https://api.github.com';
config.gitHub.gitHubEndPoint = 'https://github.com';

config.gitHub.client_id = process.env.client_id; //from .env file
config.gitHub.client_secret = process.env.client_secret; //from .env file

config.gitHub.orgName = '[your organization or personal GitHub name here]'; //Taken from github for example: https://github.com/[this] which can be your organization or username

config.web.port = process.env.PORT || 3000;
config.web.gitCaptainStatus = 'up'; //'down' or 'up' only
config.web.gitCaptainReason = 'Currently up!'; //'any reason you want'
config.web.gitCaptainTimeOutInMinutes = 25;

config.web.privateKeyPath = process.env.privateKeyPath;
config.web.certificatePath = process.env.certificatePath;

module.exports = config;

Object.freeze(config);
Object.freeze(config.gitHub);
Object.freeze(config.web);