/* eslint-disable consistent-return */
const { sanitiseObj } = require('../utils/generalFunctions');
const UsersController = require('../controllers/usersController');
const { ConflictError, InvalidDataError } = require('../errors');

module.exports = async (req, res, next) => {
  try {
    const userData = sanitiseObj(req.body);
    UsersController.validateUser(req.body);
    await UsersController.checkExistingUser(userData.email);
    req.userData = userData;
    next();
  } catch (err) {
    if (err instanceof InvalidDataError) {
      console.error(err);
      res.status(422).json({
        error: 'Não foi possível processar o formato dos dados',
        details: err.details,
      });
    }
    if (err instanceof ConflictError) {
      console.error(err);
      res.status(409).json({
        error: 'Email selecionado já existe na plataforma!',
        details: err.details,
      });
    }
  }
};
