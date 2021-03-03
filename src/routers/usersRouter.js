const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sanitiseObj } = require('../utils/generalFunctions');
const Middle = require('../middlewares');
const usersSchema = require('../schemas/usersSchemas');
const Err = require('../errors');
const redis = require('../utils/redis');
const CoursesController = require('../controllers/CoursesController');
const UsersController = require('../controllers/UsersController');

const upload = require('../utils/multer');

router.post('/sign-up', Middle.validateUser, async (req, res) => {
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

router.post('/sign-in', Middle.userLogin, async (req, res) => {
  delete req.user.password;
  const token = jwt.sign(req.user, process.env.SECRET);

  await redis.setSession(token, req.user.email);

  const cookieOptions = {};

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'none';
  }

  res.cookie('token', token, cookieOptions);
  res.status(200).send(req.user);
});

router.put('/:id', Middle.userAuthentication, Middle.schemaMiddleware(usersSchema.putUser), async (req, res) => {
  const id = Number(req.params.id);
  const sanitized = sanitiseObj(req.body);

  const updatedUser = await UsersController.editUser(id, sanitized);

  delete updatedUser.dataValues.password;
  res.status(200).send(updatedUser.dataValues);
});

router.post('/sign-out', Middle.userAuthentication, async (req, res) => {
  await redis.deleteSession(req.token);
  res.clearCookie('token');
  
  res.sendStatus(200);
});

router.post('/forgot-password', Middle.schemaMiddleware(usersSchema.forgot), async (req, res) => {
  const user = await UsersController.findUserByEmail(req.body.email);
  if (!user) {
    return res.sendStatus(202);
  }

  const token = await redis.setItem(user.id);

  await UsersController.sendEmail(user.email, token, user.name);
  res.sendStatus(202);
});

router.post('/redefine-password', Middle.schemaMiddleware(usersSchema.redefine), async (req, res) => {
  const userId = await redis.getItem(req.body.token);
  const { password } = sanitiseObj(req.body);

  if (!userId) {
    throw new Err.ForbiddenError('Token inválido ou expirado');
  }

  await UsersController.editUser(userId, { password });
  res.sendStatus(200);
});

router.post('/last-course/:id', Middle.userAuthentication, async (req, res) => {
  const id = +req.params.id;
  await CoursesController.getCourse(id);

  const user = await UsersController.changeLastCourse(id, req.user.id);
  res.status(200).send(user);
});

router.post('/avatar', Middle.userAuthentication, upload.single('avatar'), async (req, res) => {
  if (req.file === undefined) {
    res.sendStatus(400);
  } else {
    const user = await UsersController.changeAvatar(req.user.id, req.file);

    res.status(200).send(user);
  }
});

module.exports = router;
