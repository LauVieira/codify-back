const router = require('express').Router();
const CoursesController = require('../../controllers/CoursesController');
const { InvalidDataError } = require('../../errors');
const schemas = require('../schemas');
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

module.exports = router;
