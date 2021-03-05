const router = require('express').Router();
const CoursesController = require('../controllers/CoursesController');

router.get('/suggestions', async (req, res) => {
  const suggestions = await CoursesController.getSuggestions(req.user.id);

  res.status(200).send(suggestions);
});

router.get('/initialized', async (req, res) => {
  const initialized = await CoursesController.getInitializedCourses(req.user.id);
  
  res.status(200).send(initialized);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  let course = await CoursesController.getCourse(id);
  const program = await CoursesController.getProgram(req.user.id, id);
  const progress = await CoursesController.getProgress(req.user.id, id);

  console.log(progress, 'progress');
  course.dataValues = { ...course.dataValues, progress };

  res.status(200).send({ course, program });
});

router.get('/:id/is-initialized', async (req, res) => {
  const id = +req.params.id;

  const isInitialized = await CoursesController.isInitialized(id, req.user.id);

  res.status(200).send({ initialized: isInitialized });
});

router.get('/chapters/:chapterId/topics/:topicId/activities', async (req, res) => {
  const params = req.params;

  const chapter = await CoursesController.getChapter(+params.chapterId);
  const topic = await CoursesController.getTopic(+params.topicId, req.user.id);
  
  res.status(200).send({ topic, chapter });
});

router.post('/:id/activities/:activityId', async (req, res) => {
  const params = req.params;

  await CoursesController.getCourse(+params.id);
  const activity = await CoursesController.getActivity(+params.activityId);
  const activityDone = await CoursesController.activityDone(activity.id, req.user.id, +params.id);
  
  res.status(201).send(activityDone);
});

module.exports = router;
