const router = require('express').Router();

const adminUsersRouter = require('./adminUsersRouter');
const adminCoursesRouter = require('./adminCoursesRouter');
const adminTopicsRouter = require('./adminTopicsRouter');
const adminChaptersRouter = require('./adminChaptersRouter');
const adminAuthentication = require('../../middlewares/adminAuthentication');

router.use('/users', adminUsersRouter);
router.use('/courses', adminAuthentication, adminCoursesRouter);
router.use('/topics', adminAuthentication, adminTopicsRouter);
router.use('/chapters', adminAuthentication, adminChaptersRouter);

module.exports = router;
