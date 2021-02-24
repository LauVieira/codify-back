const Course = require('../models/Course');
const User = require('../models/User');
const CourseUser = require('../models/CourseUser');
const ActivityUser = require('../models/ActivityUser');
const Activity = require('../models/Activity');
const Chapter = require('../models/Chapter');
const Exercise = require('../models/Exercise');
const Theory = require('../models/Theory');
const Topic = require('../models/Topic');

User.belongsToMany(Course, { through: CourseUser });
Course.belongsToMany(User, { through: CourseUser });

Course.hasMany(Chapter);
Chapter.belongsTo(Course);
Chapter.hasMany(Topic);

Topic.hasMany(Activity);
Topic.belongsTo(Chapter);

Activity.hasOne(Theory);
Activity.hasOne(Exercise);
Activity.hasMany(ActivityUser);
Activity.belongsTo(Topic);

Theory.belongsTo(Activity);

Activity.belongsToMany(User, { through: ActivityUser });
User.belongsToMany(Activity, { through: ActivityUser });
