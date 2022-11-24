//elbv2.js
const AWS = require('aws-sdk');
const configStateDefault = { "AWS": {
    config: {region: "us-east-1"}
  }
}
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetHealth-property

module.exports.describeTargetHealth = (TargetGroupArn, configState=configStateDefault) => {
// node -p -e 'require("./scripts/elbv2.js").describeTargetHealth("TargetGroupArn");'
//usage: var TargetHealthPromise = require("./elbv2.js").describeTargetHealth("TargetGroupArn");
//node -p -e 'require("./scripts/elbv2.js").describeTargetHealth("TargetGroupArn").then((TargetHealthData) => {console.log(TargetHealthData)});'
  console.log("elbv2.describeTargetHealth( \"" + TargetGroupArn + "\", " + configState + " )")
  AWS.config.update(configState.AWS.config);
  var elbv2 = new AWS.ELBv2();

  var params = {
  TargetGroupArn: TargetGroupArn
  };
  data = elbv2.describeTargetHealth(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    //else     console.log(data);           // successful response
    return data
  }) 
  .promise()
  .then(function(data) {
    console.log(data);
    return data
  }).catch(function(err) {
    console.error(err, err.stack);
    callback(err);
  });
  return data
}

   /*
    data = {
    TargetHealthDescriptions: [
        {
      Target: {
        Id: "i-0f76fade", 
        Port: 80
      }, 
      TargetHealth: {
        Description: "Given target group is not configured to receive traffic from ELB", 
        Reason: "Target.NotInUse", 
        State: "unused"
      }
      }, 
        {
      HealthCheckPort: "80", 
      Target: {
        Id: "i-0f76fade", 
        Port: 80
      }, 
      TargetHealth: {
        State: "healthy"
      }
      }
    ]
    }
    */

  //  if (data.TargetHealthDescriptions) {
  //   data.TargetHealthDescriptions.forEach(element => {
  //     console.log("TargetHealth.State: " + element.TargetHealth.State);
  //     //TargetHealth.State: initial, unhealthy, healthy
  //     if (element.TargetHealth.State == "healthy") {
      
  //     }
  //   });
  //  }

return 0