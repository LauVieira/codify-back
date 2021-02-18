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

  const courses = await CoursesController.getAll(limit, offset);
  const total = (await CoursesController.getAll()).length;
  
  res.set({
    'Access-Control-Expose-Headers': 'Content-Range',
    'Content-Range': `${offset}-${courses.length}/${total}`
  });
  res.send(courses);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const courses = await CoursesController.getCourse(id);
  
  res.status(200).send(courses);
});

router.post('/', async (req, res) => {
  const { error } = schemas.courses.post.validate(req.body);
  if (error) throw new InvalidDataError('Não foi possível processar o formato dos dados');

  const sanitisedCourse = sanitiseObj(req.body);
  const createdCourse = await CoursesController.createCourse(sanitisedCourse);

  res.status(201).send(createdCourse);
});

router.put('/:id', async (req, res) => {
  const { error } = schemas.courses.post.validate(req.body);
  if (error) throw new InvalidDataError('Não foi possível processar o formato dos dados');

  const { id } = req.params;
  const sanitisedCourse = sanitiseObj(req.body);
  const updatedCourse = await CoursesController.editCourse(id, sanitisedCourse);
  res.status(200).send(updatedCourse);
});

module.exports = router;
