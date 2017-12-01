const boom = require('boom');
const es = require('../helpers/es');
const diariesTools = require('../tools/diaries-tool');

const internals = {};


internals.getDiaries = (request, reply) => {
  let credential = diariesTools.getCredential(request.headers);
  let searchParams = diariesTools.makeEsSearchParams(credential.accountId);

  es.search(searchParams, (searchErr, searchData) => {
    if (searchErr) {
      return reply(boom.badRequest(searchErr));
    }

    if (!searchData.hits.total) {
      return reply(boom.notFound());
    }

    let diaries = diariesTools.filterDiaries(searchData.hits.hits);

    reply(diaries);
  });
};


internals.createDiary = (request, reply) => {
  let credential = diariesTools.getCredential(request.headers);
  let payload = diariesTools.makeEsIndexPayload(credential, request.payload);

  let indexParams = {
    index: 'fbm-diaries',
    type: 'diary',
    body: payload,
  };

  es.index(indexParams, (indexErr) => {
    if (indexErr) {
      return reply(boom.badRequest(indexErr));
    }

    let response = 'ok';

    return reply(response).code(201);
  });
};


internals.deleteDiary = (request, reply) => {
  let deleteParams = diariesTools.makeEsDeleteParams(request.params.diaryId);

  es.delete(deleteParams, (deleteErr, deleteData) => {
    if (deleteErr) {
      return reply(boom.badRequest(deleteErr));
    }

    reply(deleteData);
  });
};


module.exports = [
  {
    method: 'GET',
    path: '/diaries',
    config: {},
    handler: internals.getDiaries,
  },
  {
    method: 'POST',
    path: '/diaries',
    config: {},
    handler: internals.createDiary,
  },
  {
    method: 'DELETE',
    path: '/diaries/{diaryId}',
    config: {},
    handler: internals.deleteDiary,
  },
];
