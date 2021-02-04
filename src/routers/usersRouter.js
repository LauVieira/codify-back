const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sanitiseObj } = require('../utils/generalFunctions');
const usersController = require('../controllers/usersController');
const { user, signIn } = require('../schemas/usersSchemas');
const UnauthorizedError = require('../errors/UnauthorizedError');
const InvalidDataError = require('../errors/InvalidDataError');

router.post('/sign-up', async (req, res) => {
  const validation = user.validate(req.body);
  if (validation.error) {
    return res.sendStatus(422);
  }
  const userData = sanitiseObj(req.body);
  const checkExistingUser = await usersController.findUserByEmail(userData.email);
  if (checkExistingUser) return res.sendStatus(409);

  const hashedPassword = bcrypt.hashSync(userData.password, 10);
  const savedUser = await usersController.saveUser(userData.name, userData.email, hashedPassword);
  return res.status(201).send(savedUser);
});

router.post('/sign-in', async (req, res) => {
  const validation = signIn.validate(req.body);
  if (validation.error) throw new InvalidDataError('Informações inválidas');

  const userData = sanitiseObj(req.body);
  let selectedUser = await usersController.findUserByEmail(userData.email);
  if (!selectedUser) throw new UnauthorizedError('Email ou senha incorretos');

  const valid = bcrypt.compareSync(userData.password, selectedUser.password);
  if (!valid) throw new UnauthorizedError('Email ou senha incorretos');
  selectedUser = {
    id: selectedUser.id,
    email: selectedUser.email,
    name: selectedUser.name,
  };
  const token = jwt.sign(selectedUser, process.env.SECRET);
  res.cookie('token', token);
  res.status(200).send(selectedUser);
});

module.exports = router;
