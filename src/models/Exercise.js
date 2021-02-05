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
  name: {
    type: Sequelize.STRING(150),
    allowNull: false,
    unique: true
  },
  description: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  lessonId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'lessons',
      key: 'id'
    }
  },
  createdAt: {
    type: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE,
  },
}, {
  sequelize,
  modelName: 'exercise',
});

module.exports = Exercise;
