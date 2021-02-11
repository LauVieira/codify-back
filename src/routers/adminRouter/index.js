const router = require('express').Router();

const adminUsersRouter = require('./adminUsersRouter');
const adminAuthentication = require('../../middlewares/adminAuthentication');

router.use('/users', adminUsersRouter);

module.exports = router;
