'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('chapters', 'chapters_title_key');
    await queryInterface.removeConstraint('topics', 'topics_title_key');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('chapters', { 
      fields: ['title'],
      type: 'unique',
      name: 'chapters_title_key'
    });
    
    await queryInterface.addConstraint('topics', { 
      fields: ['title'],
      type: 'unique',
      name: 'topics_title_key'
    });
  }
};
