const Hapi = require('hapi');
const Endpoints = require('./endpoints');
const config = require('./config');
const Good = require('good');
const Jwt = require('hapi-auth-jwt2');


const jwtConfig = {
  key: config.jwt.secretKey,
  verifyOptions: config.jwt.token.options,
  tokenType: config.jwt.token.type,
  validateFunc: (decoded, request, next) => {
    // TODO: this needs to check if the decode data is valid
    // checking the `accountId` and `email` in the dynamodb or in-memory cache
    //
    // TODO: this also needs to check the account `status` if `deleting`
    // it should not validate
    //
    if (decoded.accountId && decoded.email) {
      next(null, true);
    } else {
      next(null, false);
    }
  },
};


const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 3000,
  routes: {
    cors: {
      credentials: true,
    },
  },
});


// regist plugin
server.register([
  {
    register: Good,
    options: {
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            response: '*',
            log: '*',
          }],
        }, {
          module: 'good-console',
        }, 'stdout'],
      },
    },
  },
  {
    register: Jwt,
  },
], (err) => {
  if (err) {
    throw err;
  }
});

// Auth
server.auth.strategy('jwt', 'jwt', jwtConfig);
server.auth.default('jwt');

// Load endpoints
for (const endpoint in Endpoints) {
  server.route(Endpoints[endpoint]);
}

// Start
server.start((err) => {
  if (err) {
    throw err;
  }
  server.log('info', `Server running at: ${server.info.uri}`);
});
