const router = require('express').Router();

// const { sanitiseObj } = require('../utils/generalFunctions');
const coursesController = require('../controllers/coursesController');
// const { NotFoundError, InvalidDataError } = require('../errors');

router.get('/suggestions', async (req, res) => {
  const suggestions = await coursesController.getSuggestions();
  res.status(200).send(suggestions);
});

module.exports = router;
