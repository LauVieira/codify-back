const admin = require('./adminRouter');
const courses = require('./coursesRouter');
const users = require('./usersRouter');

module.exports = {
    courses,
    users,
    admin
};
