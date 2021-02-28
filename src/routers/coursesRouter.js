const router = require('express').Router();
const CoursesController = require('../controllers/CoursesController');
const UsersController = require('../controllers/UsersController');

router.get('/suggestions', async (req, res) => {
  const suggestions = await CoursesController.getSuggestions(req.user.id);

  res.status(200).send(suggestions);
});

router.get('/initialized', async (req, res) => {
  const initialized = await CoursesController.getInitializedCourses(req.user.id);
  
  res.status(200).send(initialized);
});

router.get('/:id', async (req, res) => {
  const id = +req.params.id;

  const course = await CoursesController.getCourse(id);
  const program = await CoursesController.getProgram(course.id);
  res.status(200).send({ course, program });
});

router.post('/:id', async (req, res) => {
  const id = +req.params.id;

  const courseUser = await CoursesController.initializeCourse(id, req.user.id);

  const user = await UsersController.changeLastCourse(id, req.user.id);
  res.status(201).send({ courseUser, user });
});

router.get('/chapters/:chapterId/topics/:topicId/activities', async (req, res) => {
  const params = req.params;

  const chapter = await CoursesController.getChapter(+params.chapterId);
  const topic = await CoursesController.getTopic(+params.topicId, req.user.id);
  
  res.status(200).send({ topic, chapter });
});

router.post('/activities/:id', async (req, res) => {
  const id = +req.params.id;

  const activity = await CoursesController.getActivity(id);
  const activityDone = await CoursesController.activityDone(activity.id, req.user.id);
  
  res.status(201).send(activityDone);
});

module.exports = router;
