/* eslint-disable quotes*/
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email='test@test.com';`
    );

    const userId = user[0][0].id;

    const courses = await queryInterface.sequelize.query(
      `SELECT id FROM courses;`
    );
    
    const courseId = courses[0][0].id;

    const activities = await queryInterface.sequelize.query(
      `SELECT id FROM activities;`
    );

    await queryInterface.bulkInsert('activityUsers', [
      {
        userId,
        activityId: activities[0][0].id,
        courseId
      },{
        userId,
        activityId: activities[0][1].id,
        courseId
      },{
        userId,
        activityId: activities[0][2].id,
        courseId
      },{
        userId,
        activityId: activities[0][3].id,
        courseId
      },{
        userId,
        activityId: activities[0][4].id,
        courseId
      }, {
        userId,
        activityId: activities[0][5].id,
        courseId
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const user = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email='test@test.com';`
    );

    const userId = user[0][0].id;

    await queryInterface.bulkDelete('activityUsers', { userId });
  }
};
