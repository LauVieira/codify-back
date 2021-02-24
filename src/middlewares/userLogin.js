const UsersController = require('../controllers/AdminController');
const { sanitiseObj } = require('../utils/generalFunctions');
const usersSchema = require('../schemas/usersSchemas');
const Err = require('../errors/');

async function userLogin (req, res, next) {
  const validation = usersSchema.signIn.validate(req.body);
  if (validation.error) {
    throw new InvalidDataError();
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

  req.user = selectedUser;

  next();
}

module.exports = userLogin;