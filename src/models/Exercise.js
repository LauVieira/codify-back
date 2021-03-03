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
  title: Sequelize.STRING,
  statement: Sequelize.STRING,
  example: Sequelize.STRING,
  sampleCode: Sequelize.STRING,
  solution: Sequelize.STRING,
}, {
  sequelize,
  modelName: 'exercise',
});

module.exports = Exercise;
