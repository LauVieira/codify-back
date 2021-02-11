const router = require('express').Router();

const adminUsersRouter = require('./adminUsersRouter');

router.use('/users', adminUsersRouter);

module.exports = router;
