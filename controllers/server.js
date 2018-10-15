/**
 * Created by JoeTavarez on 7/6/18.
 */

require('dotenv').config();

var config = require('./config'), //config file holds settings settings.
    https = require('https'),
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    request = require('request'),
    fs = require('fs'),
    app = express();

var authCode;

const gitHubAPIendpoint = config.gitHub.gitHubAPIendpoint,
    gitHubEndPoint = config.gitHub.gitHubEndPoint,
    client_id = config.gitHub.client_id,
    client_secret = config.gitHub.client_secret,
    gitCaptainStatus = config.web.gitCaptainStatus,
    gitCaptainReason = config.web.gitCaptainReason,
    orgName = config.gitHub.orgName,
    clientTimeOut = config.web.gitCaptainTimeOutInMinutes;

var privateKey  = fs.readFileSync(config.web.privateKeyPath, 'utf8');
var certificate = fs.readFileSync(config.web.certificatePath, 'utf8');
var credentials = {key:privateKey, cert: certificate};

app.set('port', config.web.port); //defines what port we are using.

app.use('/static', express.static(path.join(__dirname, '../', '/public')));
app.use(express.static(path.join(__dirname, '../', '/public/views')));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded(
    {
        extended: true
    }));


////////////////////////////////////////////////////////////////app.post starts/////////////////////////////////////////////////////////////////////
app.post('/:appName?/:webServ?', function (req, res) {

    var appName = String(req.params.appName);
    // noinspection JSUnresolvedVariable
    var webServ = String(req.params.webServ);

    //this appName && webServ design allows for multiple apps in one node.js server

    if ((appName === 'gitCaptain') && (webServ === 'createBranches')) //post (uses body).
    {

        var urlForCreate = gitHubAPIendpoint + "/repos/" + orgName + "/" + req.body.repo + "/branches/" + req.body.branchRef + "?" + req.body.token;

        // noinspection JSDuplicatedDeclaration
        var options = {
            method: 'GET',
            url: urlForCreate,
            headers: {
                'User-Agent': 'request'
            }
        };

        function callbackForRef(error, response) {
            if (!error && response.statusCode === 200) {

                var myJSONobjRef = JSON.parse(response.body);

                var urlForBranches = gitHubAPIendpoint + "/repos/" + orgName + "/" + req.body.repo + "/git/refs?" + req.body.token;

                // noinspection JSUnresolvedVariable
                var options = {
                    method: 'POST',
                    url: urlForBranches,
                    headers: {
                        'User-Agent': 'request'
                    },
                    body: JSON.stringify({
                        ref: "refs/heads/" + req.body.newBranch,
                        sha: myJSONobjRef.commit.sha
                    })
                };

                /////////////////////////////////////////////////////////////////////////////
                function callBackBranches(error, response) {
                    if (!error && response.statusCode === 201) {
                        res.send(response);
                    }
                    else {
                        res.send(response); //send back response if not 200, but needs to be updated to handle exception.
                    }
                }

                request(options, callBackBranches);
                /////////////////////////////////////////////////////////////////////////////
            }
            else {
                res.send(response); //send back response if not 200, but needs to be updated to handle exception.
            }
        }

        request(options, callbackForRef);


    }

    else if ((appName === 'gitCaptain') && (webServ === 'getToken')) //post (uses body).
    {
        authCode = req.query.code;

        var urlForToken = gitHubEndPoint + "/login/oauth/access_token" + "?client_id=" + client_id + "&client_secret=" + client_secret + "&code=" + authCode + "&scope=repo";

        // noinspection JSDuplicatedDeclaration
        var options = {
            method: 'POST',
            url: urlForToken,
            headers: {
                'User-Agent': 'request'
            }
        };

        function getTokenCallBack(error, response) {
            if (!error && response.statusCode === 200) {
                res.send(response);
            }
        }

        request(options, getTokenCallBack);

    }

    else if ((appName === 'gitCaptain') && (webServ === 'searchForBranch')) //post (uses body).
    {

        var urlForSearch = gitHubAPIendpoint + "/repos/" + orgName + "/" + req.body.repo + "/branches/" + req.body.searchForBranch + "?" + req.body.token;


        // noinspection JSDuplicatedDeclaration
        var options = {
            method: 'GET',
            url: urlForSearch,
            headers: {
                'User-Agent': 'request'
            }
        };

        function callbackForSearch(error, response) {
            if (!error && response.statusCode === 200) {
                res.send(response);
            }
            else {
                res.send(response); //send back response if not 200, but needs to be updated to handle exception.
            }
        }

        request(options, callbackForSearch);
    }

    else if ((appName === 'gitCaptain') && (webServ === 'searchForPR')) //create Branches
    {
        var urlForPRsearch = gitHubAPIendpoint + "/repos/" + orgName + "/" + req.body.repo + "/pulls?" + "state=" + req.body.state + "&base=" + req.body.prBaseBranch + "&" + req.body.token;

        // noinspection JSDuplicatedDeclaration
        var options = {
            method: 'GET',
            url: urlForPRsearch,
            headers: {
                'User-Agent': 'request'
            }
        };

        function callbackForPRSearch(error, response) {
            if (!error && response.statusCode === 200) {
                res.send(response);
            }
            else {
                res.send(response); //send back response if not 200, but needs to be updated to handle exception.
            }
        }

        request(options, callbackForPRSearch);
    }

    else if ((appName === 'gitCaptain') && (webServ === 'logOff')) //post (uses body).
    {
        var urlForRevokeToken = gitHubAPIendpoint + "/applications/" + client_id + "/tokens/" + req.body.token;

        // noinspection JSDuplicatedDeclaration
        var options = {
            method: 'DELETE',
            url: urlForRevokeToken,
            auth: {
                'user': client_id,
                'pass': client_secret
            },
            headers: {
                'User-Agent': 'request'
            }
        };


        function callback(error, response) {
            res.send(response); //need to take action if not http 204!
        }

        request(options, callback);
    }

    else if ((appName === 'gitCaptain') && (webServ === 'searchForRepos')) //create Branches
    {
        var urlForRepoSearch = gitHubAPIendpoint + "/user/repos?" + req.body.token;

        // noinspection JSDuplicatedDeclaration
        var options = {
            method: 'GET',
            url: urlForRepoSearch,
            headers: {
                'User-Agent': 'request'
            }
        };

        function callbackForRepoSearch(error, response) {
            if (!error && response.statusCode === 200) {
                res.send(response);
            }
            else {
                res.send(response); //send back response if not 200, but needs to be updated to handle exception.
            }
        }

        request(options, callbackForRepoSearch);
    }


    else {
        //   res.send('notValidURL');
        res.render('404', {url: req.url}); //2
    }
});

////////////////////////////////////////////////////////////////app.del starts//////////////////////////////////////////////////////////////////////

app.delete('/:appName?/:webServ?', function (req, res) { //delete

    var appName = String(req.params.appName);
    // noinspection JSUnresolvedVariable
    var webServ = String(req.params.webServ);

    if ((appName === 'gitCaptain') && (webServ === 'deleteBranches')) {
        var urlForDelete = gitHubAPIendpoint + "/repos/" + orgName + "/" + req.body.repo + "/git/refs/heads/" + req.body.deleteBranch + "?" + req.body.token;

        var options = {
            method: 'DELETE',
            url: urlForDelete,
            headers: {
                'User-Agent': 'request'
            }
        };

        function callback(error, response) {
            res.send(response);
        }

        request(options, callback);
    }
});

////////////////////////////////////////////////////////////////app.del ends////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////app.get starts//////////////////////////////////////////////////////////////////////

app.get('/:appName?/:webServ?', function (req, res) {

    var appName = String(req.params.appName);
    // noinspection JSUnresolvedVariable
    var webServ = String(req.params.webServ);

    if ((appName === 'gitCaptain') && (webServ === 'checkGitHubStatus')) {
        var urlForGitHubStatus = "https://status.github.com/api/last-message.json";

        var options = {
            method: 'GET',
            url: urlForGitHubStatus,
            headers: {
                'User-Agent': 'request'
            }
        };

        function callback(error, response) {
            res.send(response); //need to take action if not http 204!
        }

        request(options, callback);
    }

    else if ((appName === 'gitCaptain') && (webServ === 'checkGitCaptainStatus')) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(
            {
                "statusCode": 200,
                "status": gitCaptainStatus,
                "reason": gitCaptainReason,
                "clientID": client_id,
                "orgName": orgName,
                "clientTimeout": clientTimeOut,
            }));
    }

    else if (req.url !== '/json' && req.url !== '/version' && req.url !== "/json/version") {
        res.status(404).sendFile(path.join(__dirname, '..', '/public/views/404.html')); //custom 404 error page
    }


});

app.get('*', function (req, res) {
    res.status(404).sendFile(path.join(__dirname, '..', '/public/views/404.html')); //custom 404 error page
});

https.createServer(credentials,app).listen(app.get('port'), function () {
    console.log('http server listening on port ' + app.get('port')); //custom 404 error page
});

////////////////////////////////////////////////////////////////app.get ends////////////////////////////////////////////////////////////////////////

