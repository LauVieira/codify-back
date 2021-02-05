'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        email: 'test@test.com',
        password: '123456',
        name: 'Test',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users',
      {
        email: ['test@test.com'],
      }, {});
  },
};
