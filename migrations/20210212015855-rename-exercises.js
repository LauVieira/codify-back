'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('exercices', 'exercises');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('exercises', 'exercices');
  }
};
