/* eslint-disable consistent-return */
const { sanitiseObj } = require('../utils/generalFunctions');
const UsersController = require('../controllers/usersController');
const InvalidDataError = require('../errors/InvalidDataError');
const ConflictError = require('../errors/ConflictError');

module.exports = async (req, res, next) => {
  try {
    const userData = sanitiseObj(req.body);
    UsersController.validateUser(req.body);
    await UsersController.checkExistingUser(userData.email);
    req.userData = userData;
    next();
  } catch (err) {
    if (err instanceof InvalidDataError) {
      return res.status(422).json({
        error: 'Invalid body format!',
        details: err.details,
      });
    }
    if (err instanceof ConflictError) {
      return res.status(409).json({
        error: 'Conflict!',
        details: err.details,
      });
    }
    console.error(err);
    return res.status(500).json({
      error: 'Internal server error!',
    });
  }
};
