const Course = require('../models/Course');
const User = require('../models/User');
const CourseUser = require('../models/CourseUser');

Course.belongsToMany(User, { through: CourseUser });
User.belongsToMany(Course, { through: CourseUser });
