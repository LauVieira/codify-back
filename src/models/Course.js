const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');
const Topic = require('./Topic');

class Course extends Sequelize.Model {

}

Course.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  icon: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  background: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE,
  },
}, {
  sequelize,
  modelName: 'course',
});

Course.hasMany(Topic);

module.exports = Course;
