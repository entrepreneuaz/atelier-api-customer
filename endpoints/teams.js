const joi = require('joi');
// const es = require('../helpers/es');
// const boom = require('boom');
// const uuid = require('uuid/v4');
// const bcrypt = require('bcrypt');
// const accountTools = require('../tools/accounts-tool');
// const hoek = require('hoek');
// const moment = require('moment');

const internals = {};


internals.createTeam = (request, reply) => {
  return reply();
};


internals.getTeam = (request, reply) => {
  return reply();
};


module.exports = [
  {
    method: 'POST',
    path: '/teams',
    config: {
      auth: false,
      validate: {
        payload: {
          name: joi.string().alphanum().min(3).max(30).required(),
          handle: joi.string().alphanum().min(3).max(30).required(),
          email: joi.string().email().default(null),
          password: joi.string().regex(/[\x01-\x7E]{3,30}$/).required(),
          passwordConfirm: joi.string().regex(/[\x01-\x7E]{3,30}$/).required(),
          birthday: joi.string().required(),
          team: joi.string().default(null),
          sex: joi.string().required(),
          region: joi.string().default(null),
          position: joi.exist(),
          comment: joi.string().default(null),
          privating: joi.boolean().required(),
        },
      },
      payload: {
        allow: 'application/json',
      },
    },
    handler: internals.createTeam,
  },
  {
    method: 'GET',
    path: '/teams/{teamId}',
    config: {},
    handler: internals.getTeam,
  },

];
