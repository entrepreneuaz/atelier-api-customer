const internals = {};


internals.defaults = {
  jwt: {
    // to generate secret:
    // node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
    secretKey: 'NcGjPY3sjPtJpXY6SOlCZRYP9ZfZYVxLh6cPt2H9QRVAp7LdlqKvZeJtAJx+p3cU2dayyf/sJ1im/vEd6DOz/gYig33RSTyR7q/iTTTXqWeH5h1gJmH6lHQpuJr5bTiXMeHptr/wHiAqldp438EY3PeVMyXMTVpKohuzE6CrJgNhW1WTYafojNKWdXYySWUtrwVeYkMmFN9tT36fQDCiwPJf2QgJHcNI0ePGr8cVgEa7yUS7gabmnd5HPnREukT1TLXl9u9qJGyXYmxCYMC6Obb+zA87MagF/dtOXsoxdJETSWa5fCBt0puvgx0PAO6Nqe/xnXIPgBmZmqoV5VA9jA==',
    token: {
      options: {
        algorithm: 'HS256',
        expiresIn: '1 day',
      },
      type: 'Token',
    },
  },
  aws: {
    sdk: {
      // http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/browser-configuring.html
    },
  },
  elasticsearch: {
    options: {
      host: 'https://search-fb-meister-spjxxqpijrgz2dakrjp2izmnrm.ap-northeast-1.es.amazonaws.com',
    },
  },
  lab: {
    account: {
      email: 'lab-test@fbminc.info',
      password: 'lab-test',
    },
    statusCode: {
      success: 200,
      ok: 200,
      created: 201,
      noContent: 204,
    },
  },
};


module.exports = internals.defaults;
