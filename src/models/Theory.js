const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Theory extends Sequelize.Model {

}

Theory.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  youtubeLink: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  activityId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  done: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'theory',
});

module.exports = Theory;
