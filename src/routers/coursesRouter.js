const router = require('express').Router();
const CoursesController = require('../controllers/CoursesController');
const UsersController = require('../controllers/UsersController');

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

router.post('/:id', async (req, res) => {
  const params = req.params;

  const courseUser = await CoursesController.initializeCourse(params.id, req.user.id);

  const user = await UsersController.changeLastCourse(params.id, req.user.id);
  res.status(201).send({ courseUser, user });
});

router.get('/chapters/:chapterId/topics/:topicId/activities', async (req, res) => {
  const params = req.params;

  const chapter = await CoursesController.getChapter(params.chapterId);
  const topic = await CoursesController.getTopic(params.topicId, req.user.id);
  
  res.status(200).send({ topic, chapter });
});

router.post('/activities/:id', async (req, res) => {
  const params = req.params;

  const activity = await CoursesController.getActivity(params.id);
  const activityDone = await CoursesController.activityDone(activity.id, req.user.id);
  
  res.status(201).send(activityDone);
});

module.exports = router;
