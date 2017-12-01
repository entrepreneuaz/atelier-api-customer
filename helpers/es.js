const AWS = require('./aws');
const HttpAwsEs = require('http-aws-es');
const config = require('../config');


const options = {
  hosts: [config.elasticsearch.options.host],
  connectionClass: HttpAwsEs,
  awsConfig: AWS.config,
  httpOptions: {},
};


const es = require('elasticsearch').Client(options);


module.exports = es;
