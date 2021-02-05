const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sanitiseObj } = require('../utils/generalFunctions');
const usersController = require('../controllers/usersController');
const validateUser = require('../middlewares/validateUser');
const { user, signIn } = require('../schemas/usersSchemas');
const UnauthorizedError = require('../errors/UnauthorizedError');
const InvalidDataError = require('../errors/InvalidDataError');

router.post('/sign-up', validateUser, async (req, res) => {
  const { name, email, password } = req.userData;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const savedUser = await usersController.saveUser(
    name,
    email,
    hashedPassword,
  );
  res.status(201).send(savedUser);
});

router.post('/sign-in', async (req, res) => {
  const validation = signIn.validate(req.body);
  if (validation.error) throw new InvalidDataError(validation.error.details.map((e) => e.message));

  const userData = sanitiseObj(req.body);
  let selectedUser = await usersController.findUserByEmail(userData.email);
  if (!selectedUser) throw new UnauthorizedError('Usuário ou senha incorretos');

  const valid = bcrypt.compareSync(userData.password, selectedUser.password);
  if (!valid) throw new UnauthorizedError('Usuário ou senha incorretos');
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
