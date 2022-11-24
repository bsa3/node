//ec2.js
// jshint esversion: 8
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
const AWS = require('aws-sdk');
const configStateDefault = { "AWS": {
    config: {region: "us-east-1"},
    ec2: {
      params: {
        Filters: [
            {
           Name: "resource-id", 
           Values: [ "i-1234567890abcdef8"]
          }
         ]
      }
    }
  }
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTags-property
module.exports.describeTags = async (configState=configStateDefault) => {
// node -p -e 'require("./scripts/ec2.js").describeTags({ "AWS": { config: {region: "us-east-1"}, ec2: { params: { Filters: [ {  Name: "resource-id", Values: [ "i-1234567890abcdef8"] } ] } }  }});'
// usage: var describeTagsPromise = require("./ec2.js").describeTags(configState);
// node -p -e 'require("./scripts/ec2.js").describeTags("configState).then((data) => {console.log(data)});'
  console.log("ec2.describeTags( " + JSON.stringify(configState, null, 2)  + " )");
  AWS.config.update(configState.AWS.config);
  var ec2 = new AWS.EC2();
  var params = configState.AWS.ec2.params;
  var data = await ec2.describeTags(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else { console.log("data:" + JSON.stringify(data, null, 2)) 
    }
  }).promise().then(data => {return data});
  return data

   /*
    data = {
     Tags: [
        {
       Key: "Stack", 
       ResourceId: "i-1234567890abcdef8", 
       ResourceType: "instance", 
       Value: "test"
      }, 
        {
       Key: "Name", 
       ResourceId: "i-1234567890abcdef8", 
       ResourceType: "instance", 
       Value: "Beta Server"
      }
     ]
    }
    */
};
   
module.exports.AutoScalingGroupName = async (configState=configStateDefault) => {
// node -p -e 'require("./scripts/ec2.js").AutoScalingGroupName({ "AWS": { config: {region: "us-east-1"}, ec2: { params: { Filters: [ {  Name: "resource-id", Values: [ "i-03d9327bdd247f9b2"] } ] } }  }}).then(AutoScalingGroupName => {console.log("AutoScalingGroupName:"+JSON.stringify(AutoScalingGroupName, null, 2) )})'
    var AutoScalingGroupName = exports.describeTags( configState ).then(data => {
        //console.log("data:" + JSON.stringify(data, null, 2))
        configState.autoscalingObject = data.Tags.find(o => o.Key === 'aws:autoscaling:groupName')
        //console.log(configState.autoscalingObject.Value);
        return configState.autoscalingObject.Value
    }).then(AutoScalingGroupName => { return AutoScalingGroupName });
    return AutoScalingGroupName
};

return 0;
