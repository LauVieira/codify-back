/* eslint-disable consistent-return */
const { sanitiseObj } = require('../utils/generalFunctions');
const UsersController = require('../controllers/usersController');

module.exports = async (req, res, next) => {
  const userData = sanitiseObj(req.body);
  UsersController.validateUser(req.body);
  await UsersController.checkExistingUser(userData.email);
  req.userData = userData;
  next();
};
