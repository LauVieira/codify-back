'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('theories', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      youtubeLink: {
        type: Sequelize.STRING,
        allowNull: false
      },
      activityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
					model: 'activities',
					key: 'id'
				}
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('theories');
  }
};
