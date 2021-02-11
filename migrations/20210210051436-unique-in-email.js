'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('users', { 
      fields: ['email'],
      type: 'unique',
      name: 'email_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('users', 'email_unique');
  }
};
