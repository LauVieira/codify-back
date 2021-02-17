const router = require('express').Router();
const CoursesController = require('../../controllers/CoursesController');
const { InvalidDataError } = require('../../errors');
const schemas = require('../../schemas');
const { sanitiseObj } = require('../../utils/generalFunctions');

router.get('/', async (req, res) => {
  let limit = null;
  let offset = null;

  if (req.query.range) {
    const range = JSON.parse(req.query.range);
    limit = range[1] - range[0] + 1;
    offset = range[0];
  }

  const topics = await CoursesController.getAllTopics(limit, offset);
  const total = (await CoursesController.getAllTopics()).length;
  
  res.set({
    'Access-Control-Expose-Headers': 'Content-Range',
    'Content-Range': `${offset}-${topics.length}/${total}`
  });
  res.send(topics);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const topic = await CoursesController.getTopicById(id);
  
  res.status(200).send(topic);
});

router.post('/', async (req, res) => {
  const { error } = schemas.courses.postTopic.validate(req.body);
  if (error) throw new InvalidDataError('Não foi possível processar o formato dos dados');

  const sanitisedTopic = sanitiseObj(req.body);
  const createdTopic = await CoursesController.createTopic(sanitisedTopic);

  res.status(201).send(createdTopic);
});

router.put('/:id', async (req, res) => {
  const { error } = schemas.courses.postTopic.validate(req.body);
  if (error) throw new InvalidDataError('Não foi possível processar o formato dos dados');

  const { id } = req.params;
  const sanitisedTopic = sanitiseObj(req.body);
  const updatedTopic = await CoursesController.editTopic(id, sanitisedTopic);
  res.status(200).send(updatedTopic);
});

// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;

//   await CoursesController.deleteCourse(id);
//   res.sendStatus(204);
// });

module.exports = router;
