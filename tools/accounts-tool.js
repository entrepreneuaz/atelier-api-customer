const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');

const internals = {};


internals.filterAccountData = (account) => {
  return {
    accountId: account.accountId,
    email: account.email,
    name: account.name || null,
  };
};


internals.filterAccountDetailData = (account) => {
  return {
    accountId: account.accountId,
    email: account.email,
    name: account.name || null,
    handle: account.handle || null,
    birthday: account.birthday || null,
    sex: account.sex || null,
    region: account.region || null,
    position: account.position || null,
    comment: account.comment || null,
    private: account.private || null,
    status: account.status || null,
    createdAt: account.createdAt || null,
    updatedAt: account.createdAt || null,
    friendsId: account.friendsId || null,
  };
};


internals.generateSessionToken = (account) => {
  return jwt.sign({
    accountId: account.accountId,
    email: account.email,
  });
};


internals.makePayload = (request) => {
  return {
    accountId: uuid().replace(/-/g, ''),
    name: request.payload.name,
    handle: request.payload.handle,
    email: request.payload.email,
    password: bcrypt.hashSync(request.payload.password, 10),
    birthday: request.payload.birthday,
    sex: request.payload.sex,
    region: request.payload.region,
    position: request.payload.position,
    comment: request.payload.comment,
    privating: request.payload.privating,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: request.payload.createdAt,
    friendsId: [],
  };
};


internals.makeEsSearchParams = (queryType, queryValue) => {
  let searchParams = {
    index: 'fbm-accounts',
    type: 'account',
    q: `${queryType}: ${queryValue}`,
    defaultOperator: 'AND',
  };

  return searchParams;
};


module.exports = internals;
