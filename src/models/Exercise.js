const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Exercise extends Sequelize.Model {

}

Exercise.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  activityId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  done: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  title: Sequelize.STRING
}, {
  sequelize,
  modelName: 'exercise',
});

module.exports = Exercise;
