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

  const { count: total, rows: chapters } = await CoursesController.getAllChapters(limit, offset);
  
  res.set({
    'Access-Control-Expose-Headers': 'Content-Range',
    'Content-Range': `${offset || 0}-${chapters.length}/${total}`
  });
  res.status(200).send(chapters);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const chapter = await CoursesController.getChapter(id);
  
  res.status(200).send(chapter);
});

router.post('/', schemaMiddleware(schemas.postChapter), async (req, res) => {
  const sanitized = sanitiseObj(req.body);
  const createdChapter = await CoursesController.createChapter(sanitized);

  res.status(201).send(createdChapter);
});

router.put('/:id', schemaMiddleware(schemas.putChapter), async (req, res) => {
  const sanitized = sanitiseObj(req.body);
  const { id } = req.params;

  const updatedChapter = await CoursesController.editChapter(id, sanitized);
  res.status(200).send(updatedChapter);
});

module.exports = router;
