const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const USER_EXISTS = 409;
const INCORRECT_DATA = 401;

const URL_REGEXP = /http[s]?:\/\/(www\.)?[\w\d\-._~:/?#[\]@!$&'()*+,;=]+#?/im;

module.exports = {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  USER_EXISTS,
  INCORRECT_DATA,
  URL_REGEXP,
};
 // const URL_REGEXP = /http[s]?:\/\/(www\.)?[\w\d\-\._~:\/?#\[\]@!\$&'()*+,;=]+#?/im;

