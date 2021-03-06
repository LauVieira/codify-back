const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class CourseUser extends Sequelize.Model { }

CourseUser.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    courseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'courseUser',
  },
);

module.exports = CourseUser;
