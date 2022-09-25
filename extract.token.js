const ExpressAuthExtract = require('./express.auth.extract');
const cookie = require("cookie");

const extractFromHeader = (request) => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) {
    return {
      error: true,
      message: 'Authorization header excepted or invalid bearer token.'
    }
  } else {
    return authHeader.split(' ')[1];
  }
}

const extractFromCookie = (request) => {
  const parsedCookies = cookie.parse(request.headers.cookie);
  if (request.headers.cookie || parsedCookies.token) {
    return parsedCookies.token
  } else {
    return {
      error: true,
      message: 'Cookie is excepted or invalid key.'
    }
  }
}

const extractFromQuery = (request) => {
  if (request?.query?.token) {
    return request?.query?.token
  } else {
    return {
      error: true,
      message: 'Query is excepted or invalid key.'
    }
  }
}

module.exports = function (request, extractFrom) {
  switch (extractFrom) {
    case ExpressAuthExtract.extractFromAuthHeaderAsBearerToken:
      return extractFromHeader(request);
    case ExpressAuthExtract.extractFromCookie:
      return extractFromCookie(request);
    case ExpressAuthExtract.extractFromQuery:
      return extractFromQuery(request);
  }
}
