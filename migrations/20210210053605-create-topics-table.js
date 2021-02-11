'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('topics', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      chapterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
					model: 'chapters',
					key: 'id'
				}
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('topics');
  }
};
