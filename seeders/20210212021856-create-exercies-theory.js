'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const topics = await queryInterface.sequelize.query(
      'SELECT id FROM topics;'
    );

    await queryInterface.bulkInsert('activities', [
      {
        type: 'theory',
        topicId: topics[0][0].id,
        order: 1
      },{
        type: 'exercise',
        topicId: topics[0][0].id,
        order: 2
      },{
        type: 'exercise',
        topicId: topics[0][0].id,
        order: 3
      },{
        type: 'theory',
        topicId: topics[0][1].id,
        order: 1
      },{
        type: 'exercise',
        topicId: topics[0][1].id,
        order: 2
      }, {
        type: 'exercise',
        topicId: topics[0][1].id,
        order: 3
      },{
        type: 'theory',
        topicId: topics[0][2].id,
        order: 1
      },{
        type: 'exercise',
        topicId: topics[0][2].id,
        order: 2
      },{
        type: 'exercise',
        topicId: topics[0][2].id,
        order: 3
      }, {
        type: 'theory',
        topicId: topics[0][3].id,
        order: 1
      }, {
        type: 'theory',
        topicId: topics[0][4].id,
        order: 1
      },
    ], {});

    const theories = await queryInterface.sequelize.query(
      `SELECT id FROM activities WHERE type='theory';`
    );

    const exercises = await queryInterface.sequelize.query(
      `SELECT id FROM activities WHERE type='exercise';`
    );

    await queryInterface.bulkInsert('theories', [
      {
        youtubeLink: 'https://www.youtube.com/watch?v=8mei6uVttho',
        activityId: theories[0][0].id,
      },
      {
        youtubeLink: 'https://www.youtube.com/watch?v=JaTf3dhx464',
        activityId: theories[0][1].id,
      },
      {
        youtubeLink: 'https://www.youtube.com/watch?v=C_3qWjNVbPU',
        activityId: theories[0][2].id,
      },
      {
        youtubeLink: 'https://www.youtube.com/watch?v=uKjKnztS3cY',
        activityId: theories[0][3].id,
      },
      {
        youtubeLink: 'https://www.youtube.com/watch?v=xHPF9UWEW-4',
        activityId: theories[0][4].id,
      }
    ], {});

    await queryInterface.bulkInsert('exercises', [
      {
        title: 'Exercício A',
        activityId: exercises[0][0].id,
      }, {
        title: 'Exercício B',
        activityId: exercises[0][1].id,
      }, {
        title: 'Exercício C',
        activityId: exercises[0][2].id,
      }, {
        title: 'Exercício C',
        activityId: exercises[0][3].id,
      }, {
        title: 'Exercício C',
        activityId: exercises[0][4].id,
      }, {
        title: 'Exercício C',
        activityId: exercises[0][5].id,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('theories');
    await queryInterface.bulkDelete('exercises'); 
    await queryInterface.bulkDelete('activities');
  }
};
