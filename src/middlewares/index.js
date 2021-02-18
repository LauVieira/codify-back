const userAuthentication = require('./userAuthentication');
const validateUser = require('./validateUser');
const adminLogin = require('./adminLogin');
const errorHandlerMiddleware = require('./errorHandlerMiddleware');

module.exports = {
  userAuthentication,
  validateUser,
  adminLogin,
  errorHandlerMiddleware
};
