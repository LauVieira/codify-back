const router = require('express').Router();

const adminUsersRouter = require('./adminUsersRouter');
const adminCoursesRouter = require('./adminCoursesRouter');
const adminTopicsRouter = require('./adminTopicsRouter');
const adminChaptersRouter = require('./adminChaptersRouter');
const adminAuthentication = require('../../middlewares/adminAuthentication');

router.use('/users', adminUsersRouter);
router.use('/courses', adminCoursesRouter);
router.use('/topics', adminTopicsRouter);
router.use('/chapters', adminChaptersRouter);
//adminAuthentication
module.exports = router;
