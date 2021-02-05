const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');
const Exercise = require('./Exercise');

class Lesson extends Sequelize.Model {

}

Lesson.init({
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
  videoLink: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  topicId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'topics',
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
  modelName: 'lesson',
});

Lesson.hasMany(Exercise);

module.exports = Lesson;
