#!/usr/local/bin/node
//  jshint esversion: 8
//  ./test/tests.sh | grep -E '(TEST|PASS|FAIL|Error|ENV|WARN|DEBUG)' && rm ./test/output
//  node -p 'require("./lib/app.js");'
//  https://docs.github.com/en/rest/reference/apps
//  https://docs.github.com/en/rest/guides/getting-started-with-the-checks-api

const path = require('path');
const { App } = require("@octokit/app");
const { env, config } = require('process');
//https://github.com/octokit/app.js
//  const fs = require("fs");
//  fs.readFileSync(`${process.env.GITAPP_PRIVATE_KEY_FILEPATH}`, 'utf8'),

// DEBUG
//console.log("  ENV GITAPP_PRIVATE_KEY  " + process.env.GITAPP_PRIVATE_KEY);
//console.log("  ENV GIT_PR_URL  " + process.env.GIT_PR_URL);
//console.log("  ENV CHECK_INPUT_PATH  " + process.env.CHECK_INPUT_PATH);
//console.log("  ENV CHECK_OUTPUT_PATH  " + process.env.CHECK_OUTPUT_PATH);

//////  START Default APP CONFIG  //////
var defaultConfigObj = {};
var defaultConfigObj = require("./support.js").defaultConfigObj;
//console.log(defaultConfigObj);
module.exports.defaultConfigObj = defaultConfigObj; 
//  node -p 'require("./lib/app.js").defaultConfigObj'
module.exports.configObj = defaultConfigObj;
//  node -p 'require("./lib/app.js").configObj'

////////////////////////////////////////////////// GITHUB App Authentication ////////////////////////////////////////////////////
//module.exports.auth = function (configObj=defaultConfigObj) {

module.exports.auth = function (configObj=exports.configObj, defaultConfigObj=exports.configObj){
    // node --trace-warnings -p -e 'require("./lib/app.js").auth();'
    let git_appConfig = { id: parseInt(defaultConfigObj.app_id) };
    git_appConfig.baseUrl = `https://${configObj.git_hostname}/api/v3`;
    git_appConfig.privateKey = `${process.env.GITAPP_PRIVATE_KEY}`;

    app = new App(git_appConfig);
    git_appConfig.privateKey=null;  //clear the private key
    return app;
};

module.exports.jwt = function (configObj=exports.configObj, app=exports.auth()) {
    // node --trace-warnings -p -e 'require("./lib/app.js").jwt();'
    try {
        let jwt = app.getSignedJsonWebToken();  //  node -p 'require("./app.js").jwt'
        return jwt;
    } catch (error) {
        //console.error(error);
        console.log('Error: Please check the network and make sure to include your github app privateKey path in your environment BASH example: export GITAPP_PRIVATE_KEY=$(cat "$GITAPP_PRIVATE_KEY_FILEPATH");');
        require("./base.js").logError(git_appConfig, 'Error: Please check the network and make sure to include your github app privateKey path in your environment BASH example: export GITAPP_PRIVATE_KEY=$(cat "$GITAPP_PRIVATE_KEY_FILEPATH");');
    }
};

//console.log(defaultConfigObj);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getInstallationAccessToken = function (configObj=exports.configObj, octokit_app=exports.auth()) {
    //  node -e 'require("./lib/app.js").getInstallationAccessToken().then(installationAccessToken => {console.log(installationAccessToken);});'
    //console.log("getInstallationAccessToken:" + configObj);
    return require("./github.js").git_installation_id(configObj).then(installationId => {
        //console.log("### installationId: "+installationId);
        return octokit_app.getInstallationAccessToken({installationId}).then(installationAccessToken => {
            //console.log("DEBUG: refresh installationAccessToken");
            //console.log(installationAccessToken);
            configObj.installationAccessToken = installationAccessToken;
            // NOTE - the token will expire in 1 hour!    
            return configObj;
        });
    },
    (error) => { //console.log(error); 
        require("./base.js").logError(configObj, "getInstallationAccessToken: Failed.  Check network and repo permissions.");
        return error;
    });
};
////////////////////////////////////  UNDER DEVELOPMENT  /////////////////////////////////////////////////////
