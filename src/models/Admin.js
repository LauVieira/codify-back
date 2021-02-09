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
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }
},  {
        sequelize,
        modelName: 'admin'
    }
);

module.exports = Admin;
