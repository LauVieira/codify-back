'use strict';

const tables = ['users', 'courses', 'courseUsers', 'admins', 'chapters', 'topics', 'activities', 'exercises', 'theories', 'activityUsers'];
const fields = ['createdAt', 'updatedAt'];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all(tables.map(table => (
      Promise.all(fields.map(field => (
        queryInterface.changeColumn(table, field, { 
          type: Sequelize.DATE, 
          defaultValue: Sequelize.fn('NOW')
        })
      )))
    )));
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all(tables.map(table => (
      Promise.all(fields.map(field => (
        queryInterface.changeColumn(table, field, { 
          type: Sequelize.DATE,
        })
      )))
    )));
  }
};
