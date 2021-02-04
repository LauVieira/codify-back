const router = require('express').Router();
const bcrypt = require('bcrypt');
const usersController = require('../controllers/usersController');
const validateUser = require('../middlewares/validateUser');

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

module.exports = router;
