const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class ActivityUser extends Sequelize.Model { }

ActivityUser.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    activityId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    courseId: Sequelize.INTEGER,
  },
  {
    sequelize,
    modelName: 'activityUser',
  },
);

module.exports = ActivityUser;
