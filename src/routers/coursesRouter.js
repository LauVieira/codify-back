const router = require('express').Router();

// const { sanitiseObj } = require('../utils/generalFunctions');
// const coursesController = require('../controllers/coursesController');
// const { NotFoundError, InvalidDataError } = require('../errors');
const userAuthentication = require('../middlewares/userAuthentication');

router.get('/', userAuthentication, (req, res) => {
  const testing = { message: 'testing', user: req.user };
  res.send(testing);
});

module.exports = router;
