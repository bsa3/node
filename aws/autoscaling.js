//autoscaling.js
// jshint esversion: 8
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html
const AWS = require('aws-sdk');
const configStateDefault = { "AWS": {
    config: {region: "us-east-1"},
    autoscaling: {
      params: {
        AutoScalingGroupName: "my-auto-scaling-group",
        InstanceIds: [ "i-93633f9b" ],
        ShouldDecrementDesiredCapacity: false
      }
    }
  }
};

// termination not immediate, will drain from elb first
module.exports.terminateInstanceInAutoScalingGroup = (configState=configStateDefault) => {
// node -p -e 'var x=require("./scripts/autoscaling.js").terminateInstanceInAutoScalingGroup({ "AWS": { config: {region: "us-west-2"}, autoscaling: { params: { InstanceId: "i-123456789" , ShouldDecrementDesiredCapacity: true } } }}); console.log(x)'
// usage: require("./autoscaling.js").terminateInstanceInAutoScalingGroup(configState);
  console.log("autoscaling.terminateInstanceInAutoScalingGroup( " + JSON.stringify(configState, null, 2)  + " )");
  AWS.config.update(configState.AWS.config);
  var autoscaling = new AWS.AutoScaling();
  var params = configState.AWS.autoscaling.params;
  var data = autoscaling.terminateInstanceInAutoScalingGroup(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    return data;
  });
  return data;
};


module.exports.detachInstances = (configState=configStateDefault) => {
// node -p -e 'require("./scripts/autoscaling.js").detachInstances({ "AWS": { config: {region: "us-east-1"}, autoscaling: { params: { AutoScalingGroupName: "my-auto-scaling-group", InstanceIds: [ "i-93633f9b" ], ShouldDecrementDesiredCapacity: false } } }});'
// usage: var detachInstancesPromise = require("./autoscaling.js").detachInstances(configState);
  console.log("autoscaling.detachInstances( " + JSON.stringify(configState, null, 2)  + " )");
  AWS.config.update(configState.AWS.config);
  var autoscaling = new AWS.AutoScaling();
  var params = configState.AWS.autoscaling.params;

  return autoscaling.detachInstances(params, function(err, data) {
    if (err) console.log(err, err.stack);   // an error occurred
    else     console.log(data);           // successful response
    return data;
  });
  // .promise()
  // .then(function(data) {
  //   console.log(data);
  //   return data
  // }).catch(function(err) {
  //   console.error(err, err.stack);
  //   callback(err);
  // });
};
     /*
    data = {
     Activities: [
        {
          ActivityId: "5091cb52-547a-47ce-a236-c9ccbc2cb2c9", 
          AutoScalingGroupName: "my-auto-scaling-group", 
          Cause: "At 2015-04-12T15:02:16Z instance i-93633f9b was detached in response to a user request, shrinking the capacity from 2 to 1.", 
          Description: "Detaching EC2 instance: i-93633f9b", 
          Details: "details", 
          Progress: 50, 
          StartTime: <Date Representation>, 
          StatusCode: "InProgress"
      }
     ]
    }
    */

return 0;
