'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('courses', 'icon', 'photo');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('courses', 'photo', 'icon');
  }
};
