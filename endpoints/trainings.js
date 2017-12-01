const joi = require('joi');
// const es = require('../helpers/es');
// const boom = require('boom');
// const uuid = require('uuid/v4');
// const bcrypt = require('bcrypt');
// const accountTools = require('../tools/accounts-tool');
// const hoek = require('hoek');
// const moment = require('moment');

const internals = {};


internals.createTraining = (request, reply) => {
  return reply();
};


internals.getTraining = (request, reply) => {
  return reply();
};


module.exports = [
  {
    method: 'POST',
    path: '/trainings',
    config: {
      auth: false,
      validate: {
        payload: {
          name: joi.string().alphanum().min(3).max(30).required(),
          region: joi.string().default(null),
          comment: joi.string().default(null),
          privating: joi.boolean().required(),
        },
      },
      payload: {
        allow: 'application/json',
      },
    },
    handler: internals.createTraining,
  },
  {
    method: 'GET',
    path: '/trainings/{trainingId}',
    config: {},
    handler: internals.getTraining,
  },

];
