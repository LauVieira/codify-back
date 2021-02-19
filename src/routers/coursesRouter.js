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

router.get('/chapters/:chapterId/topics/:topicId/activities', async (req, res) => {
  const params = req.params;

  const chapter = await CoursesController.getChapter(params.chapterId);
  const topic = await CoursesController.getTopic(params.topicId);
  
  res.status(200).send({ topic, chapter });
});

router.post('/activities/:id', async (req, res) => {
  const obj = req.params;

  const activity = await CoursesController.getActivity(obj.id);
  await CoursesController.activityDone(activity.id, req.user.id);
  
  res.status(200).send({ message: 'Atividade feita' });
});

module.exports = router;
