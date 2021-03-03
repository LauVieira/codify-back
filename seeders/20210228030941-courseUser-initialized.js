/* eslint-disable quotes*/
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const courses = await queryInterface.sequelize.query(
      'SELECT id FROM courses;'
    );

    const user = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email='test@test.com';`
    );

    const userId = user[0][0].id;

    await queryInterface.sequelize.query(
      `UPDATE users SET "lastCourse"=${courses[0][0].id} WHERE id=${userId};`
    );

    await queryInterface.bulkInsert('courseUsers', [
      {
        userId,
        courseId: courses[0][0].id
      },
      {
        userId,
        courseId: courses[0][1].id
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const user = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email='test@test.com';`
    );

    const userId = user[0][0].id;

    await queryInterface.bulkDelete('courseUsers', { userId });
  }
};
