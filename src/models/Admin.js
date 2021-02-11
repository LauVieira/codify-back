const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Admin extends Sequelize.Model { }

Admin.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
},  {
        sequelize,
        modelName: 'admin'
    }
);

module.exports = Admin;
