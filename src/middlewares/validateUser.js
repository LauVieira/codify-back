const { sanitiseObj } = require('../utils/generalFunctions');
const UsersController = require('../controllers/UsersController');

module.exports = async (req, res, next) => {
  UsersController.validateUser(req.body);
  const sanitized = sanitiseObj(req.body);
  
  await UsersController.checkExistingUser(sanitized.email);
  
  req.userData = sanitized;
  next();
};
