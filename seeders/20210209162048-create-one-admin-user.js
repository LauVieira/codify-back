'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');

const username = process.env.ADMIN_USER;
const password = process.env.ADMIN_PASSWORD;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('admins', [{
      username,
      password: bcrypt.hashSync(password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('admins', { username }, {});
  }
};
