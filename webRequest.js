
// jshint esversion: 8
// ../node_modules/jshint/bin/jshint ./webRequest.js

var postDataDefault = JSON.stringify({"ALERT":"test"});

const configStateDefault = {
    "request": {
        options: {
            hostname: 'hooks.slack.com',
            port: 443,
            path: '/workflows/...',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', //'application/x-www-form-urlencoded',
                'Content-Length': postDataDefault.length
            }
        }
    }
};

module.exports.post = (postData=postDataDefault, configState=configStateDefault) => {
    // node -p -e 'require("./scripts/webRequest.js").post();'
    var options = configState.request.options;
    const https = require('https');
    
    var req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
            });
        return res;
    });

    req.on('error', (e) => {
    console.error(e);
    });

    req.write(postData);
    req.end();
    return 0
};
