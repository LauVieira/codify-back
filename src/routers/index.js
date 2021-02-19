const express = require('express');

const { userAuthentication } = require('../middlewares');

const adminRouter = require('./adminRouter');
const coursesRouter = require('./coursesRouter');
const usersRouter = require('./usersRouter');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/courses', /*userAuthentication*/ coursesRouter);
router.use('/admin', adminRouter);

module.exports = router;
