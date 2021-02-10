const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

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
  photo: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  background: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'course',
});

module.exports = Course;
