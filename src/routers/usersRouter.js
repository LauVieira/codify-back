const router = require('express').Router();
const bcrypt = require('bcrypt');
const usersController = require('../controllers/usersController');
const validateUser = require('../middlewares/validateUser');

router.post('/sign-up', validateUser, async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.userData.password, 10);
  const savedUser = await usersController.saveUser(
    req.userData.name,
    req.userData.email,
    hashedPassword,
  );
  return res.status(201).send(savedUser);
});

module.exports = router;
