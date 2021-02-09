'use strict';

module.exports = {
  up: async (queryInterface) => {
    const courses = await queryInterface.sequelize.query(
      'SELECT id from COURSES;'
    );

    const coursesRows = courses[0];

    await queryInterface.bulkInsert('topics', [
      {
        name: 'Apresentação',
        courseId: coursesRows[0].id,
      },
      {
        name: 'Preparando o ambiente',
        courseId: coursesRows[0].id,
      },
      {
        name: 'Introdução à linguagem JS',
        courseId: coursesRows[0].id,
      },
      {
        name: 'Variáveis e tipos de dados',
        courseId: coursesRows[0].id,
      },
      {
        name: 'Estruturas lógicas e condicionais',
        courseId: coursesRows[0].id,
      },
    ], {});

    const topics = await queryInterface.sequelize.query(
      'SELECT id from TOPICS;'
    );

    const topicsRows = topics[0];

    await queryInterface.bulkInsert('lessons', [
      {
        name: 'Aula 1',
        description: 'Aulas',
        videoLink: 'http://www.youtube.com',
        topicId: topicsRows[0].id,
      },
      {
        name: 'Aula 2',
        description: 'Aulass 2',
        videoLink: 'http://www.youtube.com',
        topicId: topicsRows[0].id,
      },{
        name: 'Aula 3',
        description: 'Aulas 3',
        videoLink: 'http://www.youtube.com',
        topicId: topicsRows[1].id,
      },{
        name: 'Aula 4',
        description: 'Aulas 4',
        videoLink: 'http://www.youtube.com',
        topicId: topicsRows[1].id,
      },{
        name: 'Aula 5',
        description: 'Aulas 5',
        videoLink: 'http://www.youtube.com',
        topicId: topicsRows[2].id,
      },{
        name: 'Aula 6',
        description: 'Aulas 6',
        videoLink: 'http://www.youtube.com',
        topicId: topicsRows[3].id,
      },{
        name: 'Aula 7',
        description: 'Aulas 7',
        videoLink: 'http://www.youtube.com',
        topicId: topicsRows[4].id,
      },
    ], {});

    const lessons = await queryInterface.sequelize.query(
      'SELECT id from LESSONS;'
    );

    const lessonsRows = lessons[0];

    await queryInterface.bulkInsert('exercises', [
      {
        name: 'Exercício 1',
        description: 'Exercícios',
        lessonId: lessonsRows[0].id,
      },
      {
        name: 'Exercício 2',
        description: 'Exercícioss 2',
        lessonId: lessonsRows[0].id,
      },{
        name: 'Exercício 3',
        description: 'Exercícios 3',
        lessonId: lessonsRows[1].id,
      },{
        name: 'Exercício 4',
        description: 'Exercícios 4',
        lessonId: lessonsRows[1].id,
      },{
        name: 'Exercício 5',
        description: 'Exercícios 5',
        lessonId: lessonsRows[2].id,
      },{
        name: 'Exercício 6',
        description: 'Exercícios 6',
        lessonId: lessonsRows[3].id,
      },{
        name: 'Exercício 7',
        description: 'Exercícios 7',
        lessonId: lessonsRows[4].id,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('exercises', null, {});
    await queryInterface.bulkDelete('lessons', null, {});
    await queryInterface.bulkDelete('topics',  null, {});    
  }
};
