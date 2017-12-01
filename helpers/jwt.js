const config = require('../config');
const jwt = require('jsonwebtoken');

const internals = {};


internals.sign = (data) => {
  return jwt.sign(data, config.jwt.secretKey, config.jwt.token.options);
};


internals.verify = (token) => {
  return jwt.verify(token, config.jwt.secretKey, config.jwt.token.options);
};


module.exports = internals;
