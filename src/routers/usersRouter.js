const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sanitiseObj } = require('../utils/generalFunctions');
const usersController = require('../controllers/usersController');
const { user, signIn } = require('../schemas/usersSchemas');

router.post('/sign-up', async (req, res) => {
  const validation = user.validate(req.body);
  if (validation.error) {
    return res.sendStatus(422);
  }
  const userData = sanitiseObj(req.body);
  const checkExistingUser = await usersController.findUserByEmail(userData.email);
  if (checkExistingUser) return res.sendStatus(403);

  const hashedPassword = bcrypt.hashSync(userData.password, 10);
  const savedUser = await usersController.saveUser(userData.name, userData.email, hashedPassword);
  return res.send(savedUser).status(201);
});

router.post('/sign-in', async (req, res) => {
  const validation = signIn.validate(req.body);
  if (validation.error) {
    return res.status(422).send({ error: error.details[0].message});
  }

  const userData = sanitiseObj(req.body);

  let selectedUser = await usersController.findUserByEmail(userData.email);
  if (!selectedUser) return res.sendStatus(404);

  const valid = bcrypt.compareSync(userData.password, selectedUser.password);
  if (!valid) return res.sendStatus(422);
  selectedUser = selectedUser.dataValues;

  const token = jwt.sign(selectedUser, process.env.SECRET);
  res.cookie('token', token);
  res.sendStatus(200);
});

module.exports = router;
