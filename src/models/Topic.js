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
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  chapterId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'topic',
});

module.exports = Topic;
