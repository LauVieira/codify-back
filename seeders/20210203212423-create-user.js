'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('users', [
      {
        email: 'test@test.com',
        password: '123456',
        name: 'test',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('users', [
      { email: 'test@test.com' },
    ], {});
  },
};
