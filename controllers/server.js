import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
const config = require('./config');

/**
 * Created by JoeTavarez on 7/6/18.
 */

// Import required modules

// Load environment variables from .env file
dotenv.config();

// Load configuration settings

// Create an instance of Express
const app = express();

// Set the port for the server
app.set('port', config.web.port);

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../', '/public')));
app.use(express.static(path.join(__dirname, '../', '/public/views')));

// Parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle POST requests
app.post('/:appName?/:webServ?', function (req, res) {
    const { appName, webServ } = req.params;

    if (appName === 'gitCaptain' && webServ === 'createBranches') {
        // Handle createBranches request
        // ...
    } else if (appName === 'gitCaptain' && webServ === 'getToken') {
        // Handle getToken request
        // ...
    } else if (appName === 'gitCaptain' && webServ === 'searchForBranch') {
        // Handle searchForBranch request
        // ...
    } else if (appName === 'gitCaptain' && webServ === 'searchForPR') {
        // Handle searchForPR request
        // ...
    } else if (appName === 'gitCaptain' && webServ === 'logOff') {
        // Handle logOff request
        // ...
    } else if (appName === 'gitCaptain' && webServ === 'searchForRepos') {
        // Handle searchForRepos request
        // ...
    } else {
        // Render 404 page for unknown requests
        res.render('404', { url: req.url });
    }
});

// Handle DELETE requests
app.delete('/:appName?/:webServ?', function (req, res) {
    const { appName, webServ } = req.params;

    if (appName === 'gitCaptain' && webServ === 'deleteBranches') {
        // Handle deleteBranches request
        // ...
    }
});

// Handle GET requests
app.get('/:appName?/:webServ?', function (req, res) {
    const { appName, webServ } = req.params;

    if (appName === 'gitCaptain' && webServ === 'checkGitHubStatus') {
        // Handle checkGitHubStatus request
        // ...
    } else if (appName === 'gitCaptain' && webServ === 'checkGitCaptainStatus') {
        // Handle checkGitCaptainStatus request
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            "statusCode": 200,
        }));
    }
});

// Handle all other routes
app.get('*', function (req, res) {
    res.status(404).sendFile(path.join(__dirname, '..', '/public/views/404.html'));
});

// Create an HTTPS server
const privateKey = fs.readFileSync(config.web.privateKeyPath, 'utf8');
const certificate = fs.readFileSync(config.web.certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };
const server = https.createServer(credentials, app);

// Start the server
server.listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});
