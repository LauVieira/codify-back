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
  },
  password: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'user',
});

module.exports = User;
