const AWS = require('aws-sdk');


AWS.config.update({ region: 'ap-northeast-1' });

if (process.env.FBM_AWS_ACCESS_KEY_ID && process.env.FBM_AWS_SECRET_ACCESS_KEY) {
  AWS.config.update({
    accessKeyId: process.env.FBM_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.FBM_AWS_SECRET_ACCESS_KEY,
  });
}


module.exports = AWS;
