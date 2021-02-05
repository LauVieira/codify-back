const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Topic extends Sequelize.Model {

}

Topic.init({
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
  courseId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'courses',
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
  modelName: 'topic',
});

module.exports = Topic;
