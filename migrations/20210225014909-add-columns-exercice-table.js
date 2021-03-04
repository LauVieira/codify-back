'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('exercises', 'statement', Sequelize.STRING);
    await queryInterface.addColumn('exercises', 'example', Sequelize.STRING);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('exercises', 'statement');
    await queryInterface.removeColumn('exercises', 'example');
  }
};
