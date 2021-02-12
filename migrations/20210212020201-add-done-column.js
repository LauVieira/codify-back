'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('exercises', 'done', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.addColumn('theories', 'done', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.addColumn('exercises', 'title', Sequelize.STRING);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('exercises', 'done');
    await queryInterface.removeColumn('theories', 'done');
    await queryInterface.removeColumn('exercises', 'title');
  }
};
