const router = require('express').Router();

// const { sanitiseObj } = require('../utils/generalFunctions');
// const coursesController = require('../controllers/coursesController');
// const { NotFoundError, InvalidDataError } = require('../errors');

router.get('/suggestions', (req, res) => {
  const testing = { message: 'testing', user: req.user };
  /* eslint-disable-next-line no-console */
  console.log(testing);
  res.sendStatus(200);
});

module.exports = router;
