'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('activityUsers', 'done');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('activityUsers', 'done', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  }
};
