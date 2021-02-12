const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sanitiseObj } = require('../utils/generalFunctions');
const UsersController = require('../controllers/UsersController');
const { validateUser } = require('../middlewares');
const Schemas = require('../schemas');
const { InvalidDataError, UnauthorizedError } = require('../errors/');

router.post('/sign-up', validateUser, async (req, res) => {
  const { name, email, password } = req.userData;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const savedUser = await UsersController.saveUser(
    name,
    email,
    hashedPassword,
  );
  res.status(201).send(savedUser);
});

router.post('/sign-in', async (req, res) => {
  const validation = Schemas.users.signIn.validate(req.body);
  if (validation.error) {
    throw new InvalidDataError('Não foi possível processar o formato dos dados');
  }

  const userData = sanitiseObj(req.body);
  let selectedUser = await UsersController.findUserByEmail(userData.email);
  if (!selectedUser) {
    throw new UnauthorizedError('Email ou senha estão incorretos');
  }

  const valid = bcrypt.compareSync(userData.password, selectedUser.password);
  if (!valid) {
    throw new UnauthorizedError('Email ou senha estão incorretos');
  }

  selectedUser = {
    id: selectedUser.id,
    email: selectedUser.email,
    name: selectedUser.name,
  };
  const token = jwt.sign(selectedUser, process.env.SECRET);

  res.cookie('token', token, { secure: true, sameSite: 'lax' });
  res.status(200).send(selectedUser);
});

module.exports = router;
