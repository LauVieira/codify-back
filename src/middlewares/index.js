const userAuthentication = require('./userAuthentication');
const validateUser = require('./validateUser');
const adminLogin = require('./adminLogin');
const errorHandlerMiddleware = require('./errorHandlerMiddleware');
const adminAuthentication = require('./adminAuthentication');
const schemaMiddleware = require('./schemaMiddleware');
const userLogin = require('./userLogin');
const multerMiddleware = require('./multerMiddleware');

module.exports = {
  userAuthentication,
  validateUser,
  adminLogin,
  errorHandlerMiddleware,
  adminAuthentication,
  schemaMiddleware,
  userLogin,
  multerMiddleware
};
