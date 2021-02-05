const router = require('express').Router();

// const { sanitiseObj } = require('../utils/generalFunctions');
const coursesController = require('../controllers/coursesController');
// const { NotFoundError, InvalidDataError } = require('../errors');

router.get('/:id', async (req, res) => {
  const obj = req.params;
  const course = await coursesController.getCourse(obj.id);
  const program = await coursesController.getProgram(course.id);
  res.status(200).send({ course, program });
});

router.get('/suggestions', async (req, res) => {
  const suggestions = await coursesController.getSuggestions();
  res.status(200).send(suggestions);
});

module.exports = router;
