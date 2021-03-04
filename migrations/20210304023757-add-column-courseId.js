'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('activityUsers', 'courseId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'courses',
        key: 'id'
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('activityUsers', 'courseId');
  }
};
