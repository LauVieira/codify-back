const router = require('express').Router();

const CoursesController = require('../../controllers/CoursesController');
const { schemaMiddleware } = require('../../middlewares');
const schemas = require('../../schemas/coursesSchemas');

router.get('/', async (req, res) => {
  let limit = null;
  let offset = null;

  if (req.query.range) {
    const range = JSON.parse(req.query.range);
    limit = range[1] - range[0] + 1;
    offset = range[0];
  }

  const chapters = await CoursesController.getAllChapters(limit, offset);
  const total = (await CoursesController.getAllChapters()).length;
  
  res.set({
    'Access-Control-Expose-Headers': 'Content-Range',
    'Content-Range': `${offset}-${chapters.length}/${total}`
  });
  res.status(200).send(chapters);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const chapter = await CoursesController.getChapter(id);
  
  res.status(200).send(chapter);
});

router.post('/', schemaMiddleware(schemas.postChapter), async (req, res) => {
    const createdChapter = await CoursesController.createChapter(req.body);

    res.status(201).send(createdChapter);
});

router.put('/:id', schemaMiddleware(schemas.putChapter), async (req, res) => {
  const { id } = req.params;

  const updatedChapter = await CoursesController.editChapter(id, req.body);
  res.status(200).send(updatedChapter);
});

module.exports = router;
