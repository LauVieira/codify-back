const router = require('express').Router();

const ActivitiesController = require('../../controllers/ActivitiesController');
const TheoriesController = require('../../controllers/TheoriesController');
const { schemaMiddleware } = require('../../middlewares');
const { sanitiseObj } = require('../../utils/generalFunctions');
const schemas = require('../../schemas/coursesSchemas');

router.get('/', async (req, res) => {
  let limit, offset = null;
  const filter = JSON.parse(req.query.filter) || {};

  if (req.query.range) {
    const range = JSON.parse(req.query.range);
    limit = range[1] - range[0] + 1;
    offset = range[0];
  }

  const { count: total, rows: theories } = await TheoriesController.getAll(limit, offset, filter);
  
  res.set({
    'Access-Control-Expose-Headers': 'Content-Range',
    'Content-Range': `${offset || 0}-${theories.length}/${total}`
  });
  res.send(theories);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const theory = await TheoriesController.getByPk(id);
  
  res.status(200).send(theory);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const activityIdToDelete = await TheoriesController.deleteByPk(id);
  await ActivitiesController.deleteByPk(activityIdToDelete);
  
  res.status(200);
});

module.exports = router;
