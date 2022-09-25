const jwt = require('jsonwebtoken');
const ExpressAuthExtract = require('./express.auth.extract');
const ExtractToken = require('./extract.token');

const config = {
  customExtractor: null,
  secretKey: null,
  roleKey: null,
  token: null,
  extractFrom: ExpressAuthExtract.extractFromAuthHeaderAsBearerToken
};


class ExpressAuth {
  constructor({
                extractFrom = ExpressAuthExtract.extractFromAuthHeaderAsBearerToken,
                secretKey = '',
                roleKey = '',
                customExtractor = null
              }) {
    if (customExtractor && typeof customExtractor === 'function') {
      config.customExtractor = customExtractor
    } else {
      config.extractFrom = extractFrom
    }

    if (!secretKey.trim()) {
      throw new Error(`Secret key is required`)
    }


    config.secretKey = secretKey

    if (roleKey) {
      config.roleKey = roleKey
    }

  }

  AuthGuard(request, response, next) {
    const info = ExpressAuth.#verify(request, response);
    if (info.error) {
      response.status(400).send(info.message);
    } else {
      if (info) {
        request.info = info;
        next()
      } else {
        response.status(401).send('Unauthenticated');
      }
    }
  }

  RoleGuard(...roles) {
    return (request, response, next) => {
      const info = ExpressAuth.#verify(request);
      if (info.error) {
        response.status(400).send(info.message);
      } else {
        if (info && info.hasOwnProperty(config.roleKey) && roles.includes(info[config.roleKey])) {
          next()
        } else {
          response.status(403).send('Unauthorized');
        }
      }
    }
  }

  static #verify(request) {
    let token;
    if (config.customExtractor) {
      token = config.customExtractor.call(this, request);
      if(!token) token={
          error: true,
          message: 'JWT token is required'
        }
    } else {
      token = ExtractToken(request, config.extractFrom);
    }
    if (token?.error) {
      return token
    } else {
      try {
        return jwt.verify(token, config.secretKey);
      } catch (err) {
        return false
      }
    }
  }
}


module.exports = {
  ExpressAuth,
  ExpressAuthExtract
}
