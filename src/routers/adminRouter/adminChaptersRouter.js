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

  const chapters = await CoursesController.getAllChapters(limit, offset);
  const total = (await CoursesController.getAllChapters()).length;
  
  res.set({
    'Access-Control-Expose-Headers': 'Content-Range',
    'Content-Range': `${offset}-${chapters.length}/${total}`
  });
  res.send(chapters);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const chapter = await CoursesController.getChapterById(id);
  
  res.status(200).send(chapter);
});

router.post('/', async (req, res) => {
  const { error } = schemas.courses.postChapter.validate(req.body);
  if (error) throw new InvalidDataError('Não foi possível processar o formato dos dados');

  const sanitisedChapter = sanitiseObj(req.body);
  const createdChapter = await CoursesController.createChapter(sanitisedChapter);

  res.status(201).send(createdChapter);
});

router.put('/:id', async (req, res) => {
  const { error } = schemas.courses.postChapter.validate(req.body);
  if (error) throw new InvalidDataError('Não foi possível processar o formato dos dados');

  const { id } = req.params;
  const sanitisedChapter = sanitiseObj(req.body);
  const updatedChapter = await CoursesController.editChapter(id, sanitisedChapter);
  res.status(200).send(updatedChapter);
});

module.exports = router;
