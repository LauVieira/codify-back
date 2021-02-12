const router = require('express').Router();
const CoursesController = require('../controllers/CoursesController');

router.get('/suggestions', async (req, res) => {
  const suggestions = await CoursesController.getSuggestions();
  res.status(200).send(suggestions);
});

router.get('/:id', async (req, res) => {
  const obj = req.params;
  const course = await CoursesController.getCourse(obj.id);
  const program = await CoursesController.getProgram(course.id);
  res.status(200).send({ course, program });
});

router.get('/topics/:id', async (req, res) => {
  const obj = req.params;
  const topic = await CoursesController.getTopic(obj.id);
  const chapter = await CoursesController.getChapter(topic.chapterId);
  res.status(200).send({ topic, chapter });
});

module.exports = router;
