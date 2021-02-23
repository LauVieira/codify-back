const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sanitiseObj } = require('../utils/generalFunctions');
const UsersController = require('../controllers/UsersController');
const { validateUser, userAuthentication, schemaMiddleware } = require('../middlewares');
const usersSchema = require('../schemas/usersSchemas');
const { InvalidDataError, UnauthorizedError } = require('../errors/');

router.post('/sign-up', validateUser, async (req, res) => {
  const { name, email, password } = req.userData;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const savedUser = await UsersController.saveUser(
    name,
    email,
    hashedPassword,
  );
  
  delete savedUser.password;
  res.status(201).send(savedUser);
});

router.post('/sign-in', async (req, res) => {
  const validation = usersSchema.signIn.validate(req.body);
  if (validation.error) {
    throw new InvalidDataError();
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

  selectedUser = selectedUser.dataValues;
  delete selectedUser.password;
  const token = jwt.sign(selectedUser, process.env.SECRET);

  const cookieOptions = {};

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'none';
  }

  res.cookie('token', token, cookieOptions);
  res.status(200).send(selectedUser);
});

router.put('/:id', userAuthentication, schemaMiddleware(usersSchema.putUser), async (req, res) => {
  const { id } = req.params;
  const sanitized = sanitiseObj(req.body);

  const updatedUser = await UsersController.editUser(id, sanitized);

  res.status(200).send(updatedUser);
});

router.post('/sign-out', userAuthentication, (req, res) => {
  res.clearCookie('token');
  
  res.status(200).send({ message: 'Sign-out efetuado com sucesso' });
});

module.exports = router;
