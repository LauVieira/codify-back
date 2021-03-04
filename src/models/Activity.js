const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Activity extends Sequelize.Model {

}

Activity.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  type: {
    type: Sequelize.ENUM('exercise', 'theory'),
    allowNull: false
  },
  order: Sequelize.INTEGER,
  topicId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  courseId: Sequelize.INTEGER
}, {
  sequelize,
  modelName: 'activity',
});

module.exports = Activity;
