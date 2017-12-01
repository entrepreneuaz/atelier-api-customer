const joi = require('joi');
const es = require('../helpers/es');
const boom = require('boom');
const accountTools = require('../tools/accounts-tool');
const bcrypt = require('bcrypt');

const internals = {};

const INVALID_CREDENTIALS = 'Email adress or password is wrong';
const EMAIL_ALREADY_IN_USE = 'Email address is already used';
const PASSWORD_NOT_SAME = 'Passwords are not match';
const PASSWORD_INVALID = 'Double-byte character is not available';


internals.createAccount = (request, reply) => {
  let searchParams =
    accountTools.makeEsSearchParams('email', request.payload.email);

  es.search(searchParams, (searchErr, searchData) => {
    if (searchErr) {
      return reply(boom.badRequest(searchErr));
    }

    if (searchData.hits.total) {
      return reply(boom.badRequest(EMAIL_ALREADY_IN_USE));
    }

    if (request.payload.password.match(/[^\x01-\x7E]/)) {
      return reply(boom.badRequest(PASSWORD_INVALID));
    }

    if (request.payload.password !== request.payload.passwordConfirm) {
      return reply(boom.badRequest(PASSWORD_NOT_SAME));
    }


    let payload = accountTools.makePayload(request);

    let indexParams = {
      index: 'fbm-accounts',
      type: 'account',
      body: payload,
    };

    es.index(indexParams, (indexErr) => {
      if (indexErr) {
        return reply(boom.badRequest(indexErr));
      }

      let response = accountTools.filterAccountData(payload);

      response.sessionToken = accountTools.generateSessionToken(payload);

      return reply(response).code(201);
    });
  });
};


internals.getAccount = (request, reply) => {
  let searchParams =
    accountTools.makeEsSearchParams('accountId', request.params.accountId);

  es.search(searchParams, (searchErr, searchData) => {
    if (searchErr) {
      return reply(boom.badRequest(searchErr));
    }

    if (!searchData.hits.total) {
      return reply(boom.notFound());
    }

    let accountData = searchData.hits.hits[0]._source;

    if (accountData.status === 'deleted') {
      return reply(boom.resourceGone());
    }

    reply(accountTools.filterAccountDetailData(accountData));
  });
};


internals.updateAccount = (request, reply) => {
  // TODO: implement update account function,
  //       but it should be allowed later.
  return reply();
};


internals.deleteAccount = (request, reply) => {
  let searchParams =
    accountTools.makeEsSearchParams('accountId', request.params.accountId);

  es.search(searchParams, (searchErr, searchData) => {
    if (searchErr) {
      return reply(boom.badRequest(searchErr));
    }

    if (!searchData.hits.total) {
      return reply(boom.notFound());
    }

    let accountData = searchData.hits.hits[0];

    if (accountData._source.status === 'deleted') {
      return reply(boom.resourceGone());
    }

    let updateParams = {
      index: 'fb-meister',
      type: 'account',
      id: accountData._id,
      body: {
        doc: {
          status: 'deleted',
        },
      },
    };

    es.update(updateParams, (err, response) => {
      if (err) {
        return reply(boom.badRequest(err));
      }

      return reply(response).code(202);
    });
  });
};


internals.login = (request, reply) => {
  let searchParams =
    accountTools.makeEsSearchParams('email', request.payload.email);

  es.search(searchParams, (searchErr, searchData) => {
    if (searchErr) {
      return reply(boom.badRequest(searchErr));
    }

    if (!searchData.hits.total) {
      return reply(boom.badRequest(INVALID_CREDENTIALS));
    }

    let accountData = searchData.hits.hits[0]._source;

    let samePassword =
      bcrypt.compareSync(request.payload.password, accountData.password);

    if (!samePassword) {
      return reply(boom.unauthorized(INVALID_CREDENTIALS));
    }

    let response = accountTools.filterAccountData(accountData);

    response.sessionToken = accountTools.generateSessionToken(accountData);

    reply(response);
  });
};


internals.me = (request, reply) => {
  return reply(request);
};


module.exports = [
  {
    method: 'POST',
    path: '/accounts',
    config: {
      auth: false,
      validate: {
        payload: {
          name: joi.string().min(3).max(30).required(),
          handle: joi.string().min(3).max(30).required(),
          email: joi.string().email().required(),
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
    handler: internals.createAccount,
  },
  {
    method: 'GET',
    path: '/accounts/{accountId}',
    config: {},
    handler: internals.getAccount,
  },
  {
    method: 'PUT',
    path: '/accounts/{accountId}',
    config: {
      validate: {
        payload: {
          name: joi.string().min(3).max(30).optional(),
          handle: joi.string().min(3).max(30).optional(),
          email: joi.string().email().optional(),
          password: joi.string().regex(/[^\x01-\x7E]{3,30}$/).optional(),
          passwordConfirm: joi.string().regex(/[^\x01-\x7E]{3,30}$/).optional(),
          birthday: joi.string().optional(),
          team: joi.string().optional(),
          sex: joi.string().optional(),
          region: joi.string().optional(),
          position: joi.exist().optional(),
          comment: joi.string().optional(),
          privating: joi.boolean().optional(),
        },
      },
      payload: {
        allow: 'application/json',
      },
    },
    handler: internals.updateAccount,
  },
  {
    method: 'DELETE',
    path: '/accounts/{accountId}',
    config: {},
    handler: internals.deleteAccount,
  },
  {
    method: 'POST',
    path: '/accounts/login',
    config: {
      auth: false,
      validate: {
        payload: {
          email: joi.string().email().required(),
          password: joi.string().regex(/[\x01-\x7E]{3,30}$/).required(),
        },
      },
    },
    handler: internals.login,
  },
  {
    method: 'GET',
    path: '/accounts/me',
    config: {},
    handler: internals.me,
  },
];
