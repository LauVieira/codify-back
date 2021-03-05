'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('exercises', 'sampleCode', Sequelize.STRING);
    await queryInterface.addColumn('exercises', 'solution', Sequelize.STRING);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('exercises', 'sampleCode');
    await queryInterface.removeColumn('exercises', 'solution');
  }
};
