const { sanitiseObj } = require('../utils/generalFunctions');
const UsersController = require('../controllers/UsersController');

module.exports = async (req, res, next) => {
  const userData = sanitiseObj(req.body);
  UsersController.validateUser(userData);
  await UsersController.checkExistingUser(userData.email);
  req.userData = userData;
  next();
};
