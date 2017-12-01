const jwt = require('../helpers/jwt');

const internals = {};


internals.getCredential = (headers) => {
  return jwt.verify(headers.authorization.slice(6));
};


internals.makeEsIndexPayload = (credential, payload) => {
  return {
    accountId: credential.accountId,
    createdAt: new Date().toISOString(),
    diaryId: new Date().getTime(),
    title: payload.title,
    contents: payload.contents,
  };
};


internals.makeEsSearchParams = (queryValue) => {
  let searchParams = {
    index: 'fbm-diaries',
    type: 'diary',
    q: `accountId: ${queryValue}`,
    defaultOperator: 'AND',
    sort: 'createdAt',
  };

  return searchParams;
};


internals.makeEsDeleteParams = (diaryId) => {
  let deleteParams = {
    index: 'fbm-diaries',
    type: 'diary',
    id: diaryId,
  };

  return deleteParams;
};


internals.filterDiaries = (data) => {
  let response = [];
  for (let d of data) {
    response.push({
      diaryId: d._source.diaryId,
      title: d._source.title,
      contents: d._source.contents,
    });
  }

  return response;
};


module.exports = internals;
