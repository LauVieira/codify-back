const { sanitiseObj } = require('../utils/generalFunctions');
const UsersController = require('../controllers/UsersController');

module.exports = async (req, res, next) => {
  const userData = UsersController.validateUser(req.body);

  const sanitized = sanitiseObj(userData);
  await UsersController.checkExistingUser(sanitized.email);
  
  req.userData = userData;
  next();
};
