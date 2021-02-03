const router = require('express').Router();

// const { sanitiseObj } = require('../utils/generalFunctions');
// const coursesController = require('../controllers/coursesController');
// const { NotFoundError, InvalidDataError } = require('../errors');

router.get('/', (req, res) => {
  const testing = { message: 'testing', user: req.user };
  res.send(testing);
});

module.exports = router;
