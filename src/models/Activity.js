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
  topicId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'activity',
});

module.exports = Activity;
