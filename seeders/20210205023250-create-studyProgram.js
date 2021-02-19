'use strict';

module.exports = {
  up: async (queryInterface) => {
    const courses = await queryInterface.sequelize.query(
      'SELECT id from COURSES;'
    );

    const courseId = courses[0][0].id;

    await queryInterface.bulkInsert('chapters', [
      {
        title: 'Apresentação',
        courseId
      },
      {
        title: 'Preparando o ambiente',
        courseId
      },
      {
        title: 'Introdução à linguagem JS',
        courseId
      },
      {
        title: 'Variáveis e tipos de dados',
        courseId
      },
      {
        title: 'Estruturas lógicas e condicionais',
        courseId
      },
    ], {});

    const chapters = await queryInterface.sequelize.query(
      'SELECT id FROM chapters;'
    );

    await queryInterface.bulkInsert('topics', [
      {
        title: 'Aula 1',
        chapterId: chapters[0][0].id,
      },
      {
        title: 'Aula 2',
        chapterId: chapters[0][0].id,
      },{
        title: 'Aula 3',
        chapterId: chapters[0][1].id,
      },{
        title: 'Aula 4',
        chapterId: chapters[0][1].id,
      },{
        title: 'Aula 5',
        chapterId: chapters[0][2].id,
      },{
        title: 'Aula 6',
        chapterId: chapters[0][3].id,
      },{
        title: 'Aula 7',
        chapterId: chapters[0][4].id,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('topics', [
      { chapterId: chapters[0][0].id },
      { chapterId: chapters[0][1].id },
      { chapterId: chapters[0][2].id },
      { chapterId: chapters[0][3].id },
      { chapterId: chapters[0][4].id }
    ]);
    
    await queryInterface.bulkDelete('chapters', { courseId });    
  }
};
