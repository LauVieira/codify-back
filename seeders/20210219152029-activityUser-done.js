/* eslint-disable quotes*/
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email='test@test.com';`
    );

    const userId = user[0][0].id;

    const activities = await queryInterface.sequelize.query(
      `SELECT id FROM activities;`
    );

    await queryInterface.bulkInsert('activityUsers', [
      {
        userId,
        activityId: activities[0][0].id
      },{
        userId,
        activityId: activities[0][1].id
      },{
        userId,
        activityId: activities[0][2].id
      },{
        userId,
        activityId: activities[0][3].id
      },{
        userId,
        activityId: activities[0][4].id
      }, {
        userId,
        activityId: activities[0][5].id
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
