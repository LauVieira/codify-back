/* eslint-disable consistent-return */
const { user } = require('../schemas/usersSchemas');
const { sanitiseObj } = require('../utils/generalFunctions');
const usersController = require('../controllers/usersController');

module.exports = async (req, res, next) => {
  const validation = user.validate(req.body);
  if (validation.error) {
    return res.sendStatus(422);
  }
  const userData = sanitiseObj(req.body);
  const checkExistingUser = await usersController.findUserByEmail(userData.email);
  if (checkExistingUser) {
    return res.sendStatus(409);
  }
  req.userData = userData;
  next();
};
