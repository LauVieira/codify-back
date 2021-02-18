'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        email: 'test@test.com',
        password: bcrypt.hashSync('123456', 10),
        name: 'teste teste',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', [
      { email: 'test@test.com' },
    ]);
  },
};
