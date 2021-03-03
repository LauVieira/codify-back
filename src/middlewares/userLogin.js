const bcrypt = require('bcrypt');
const UsersController = require('../controllers/UsersController');
const { sanitiseObj } = require('../utils/generalFunctions');
const usersSchema = require('../schemas/usersSchemas');
const Err = require('../errors');

async function userLogin (req, res, next) {
  const validation = usersSchema.signIn.validate(req.body);
  if (validation.error) {
    throw new Err.InvalidDataError();
  }

  const userData = sanitiseObj(req.body);
  let selectedUser = await UsersController.findUserByEmail(userData.email);
  if (!selectedUser) {
    throw new Err.UnauthorizedError('Email ou senha estão incorretos');
  }

  const valid = bcrypt.compareSync(userData.password, selectedUser.password);
  if (!valid) {
    throw new Err.UnauthorizedError('Email ou senha estão incorretos');
  }

  req.user = selectedUser.dataValues;

  next();
}

module.exports = userLogin;
