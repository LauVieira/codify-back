const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class User extends Sequelize.Model {

}

User.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING(150),
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  lastCourse: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'user',
});

module.exports = User;
