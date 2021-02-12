const router = require('express').Router();

const adminUsersRouter = require('./adminUsersRouter');
const adminCoursesRouter = require('./adminCoursesRouter');
const adminAuthentication = require('../../middlewares/adminAuthentication');

router.use('/users', adminUsersRouter);
router.use('/courses', adminCoursesRouter);
//adminAuthentication
module.exports = router;
