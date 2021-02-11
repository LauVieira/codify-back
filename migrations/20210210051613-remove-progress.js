'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('courseUsers', 'progress');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('courseUsers', 'progress', Sequelize.STRING);
  }
};
