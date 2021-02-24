const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sanitiseObj } = require('../utils/generalFunctions');
const UsersController = require('../controllers/UsersController');
const { validateUser, userAuthentication, schemaMiddleware, userLogin } = require('../middlewares');
const usersSchema = require('../schemas/usersSchemas');
const sessionStore = require('../utils/redis');

router.post('/sign-up', validateUser, async (req, res) => {
  const { name, email, password } = req.userData;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const savedUser = await UsersController.saveUser(
    name,
    email,
    hashedPassword,
  );
  
  delete savedUser.dataValues.password;
  res.status(201).send(savedUser.dataValues);
});

router.post('/sign-in', userLogin, async (req, res) => {
  delete req.user.password;
  const token = jwt.sign(req.user, process.env.SECRET);

  await sessionStore.setSession(token, req.user.email);

  const cookieOptions = {};

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'none';
  }

  res.cookie('token', token, cookieOptions);
  res.status(200).send(req.user);
});

router.put('/:id', userAuthentication, schemaMiddleware(usersSchema.putUser), async (req, res) => {
  const { id } = req.params;
  const sanitized = sanitiseObj(req.body);

  const updatedUser = await UsersController.editUser(id, sanitized);

  delete updatedUser.dataValues.password;
  res.status(200).send(updatedUser.dataValues);
});

router.post('/sign-out', userAuthentication, async (req, res) => {
  await sessionStore.deleteSession(req.token);
  res.clearCookie('token');
  
  res.sendStatus(200);
});

module.exports = router;
