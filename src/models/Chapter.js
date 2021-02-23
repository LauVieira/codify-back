const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Chapter extends Sequelize.Model {

}

Chapter.init({
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
  courseId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'chapter',
});

module.exports = Chapter;
