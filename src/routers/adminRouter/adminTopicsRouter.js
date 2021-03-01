const router = require('express').Router();

const CoursesController = require('../../controllers/CoursesController');
const { schemaMiddleware } = require('../../middlewares');
const { sanitiseObj } = require('../../utils/generalFunctions');
const schemas = require('../../schemas/coursesSchemas');

router.get('/', async (req, res) => {
  let limit, offset = null;

  if (req.query.range) {
    const range = JSON.parse(req.query.range);
    limit = range[1] - range[0] + 1;
    offset = range[0];
  }

  const { count: total, rows: topics } = await CoursesController.getAllTopics(limit, offset);
  
  res.set({
    'Access-Control-Expose-Headers': 'Content-Range',
    'Content-Range': `${offset || 0}-${topics.length}/${total}`
  });
  res.send(topics);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const topic = await CoursesController.getTopicById(id);
  
  res.status(200).send(topic);
});

router.post('/', schemaMiddleware(schemas.postTopic) , async (req, res) => {
  const sanitized = sanitiseObj(req.body);
  const createdTopic = await CoursesController.createTopic(sanitized);

  res.status(201).send(createdTopic);
});

router.put('/:id', schemaMiddleware(schemas.putTopic), async (req, res) => {
  const sanitized = sanitiseObj(req.body);
  const { id } = req.params;

  const updatedTopic = await CoursesController.editTopic(id, sanitized);
  res.status(200).send(updatedTopic);
});

module.exports = router;
