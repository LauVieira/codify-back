'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const theories = await queryInterface.sequelize.query(
      'SELECT id FROM activities WHERE type="theory";'
    );

    const exercises = await queryInterface.sequelize.query(
      'SELECT id FROM activities WHERE type="exercise";'
    );

    await queryInterface.bulkInsert('theories', [
      {
        youtubeLink: 'https://www.youtube.com/watch?v=8mei6uVttho',
        activityId: theories[0][0].id,
      },
      {
        youtubeLink: 'https://www.youtube.com/watch?v=JaTf3dhx464',
        activityId: theories[0][1].id,
      }
    ], {});

    await queryInterface.bulkInsert('exercises', [
      {
        title: 'Exercício 1',
        activityId: exercises[0][0].id,
      },
      {
        title: 'Exercício 2',
        activityId: exercises[0][1].id,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('theories', null, {});
    await queryInterface.bulkDelete('exercises',  null, {});  
  }
};
