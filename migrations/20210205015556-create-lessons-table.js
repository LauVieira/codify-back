'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lessons', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      videoLink: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      topicId: {
        type: Sequelize.INTEGER,
        references: {
					model: 'topics',
					key: 'id'
				}
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('lessons');
  }
};
