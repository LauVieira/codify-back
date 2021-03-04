/* eslint-disable quotes*/
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const topics = await queryInterface.sequelize.query(
      'SELECT id FROM topics;'
    );

    const courses = await queryInterface.sequelize.query(
      `SELECT id FROM courses;`
    );
    
    const courseId = courses[0][0].id;

    await queryInterface.bulkInsert('activities', [
      {
        type: 'theory',
        topicId: topics[0][0].id,
        order: 1,
        courseId
      },{
        type: 'exercise',
        topicId: topics[0][0].id,
        order: 2,
        courseId
      },{
        type: 'exercise',
        topicId: topics[0][0].id,
        order: 3,
        courseId
      },{
        type: 'theory',
        topicId: topics[0][1].id,
        order: 1,
        courseId
      },{
        type: 'exercise',
        topicId: topics[0][1].id,
        order: 2,
        courseId
      }, {
        type: 'exercise',
        topicId: topics[0][1].id,
        order: 3,
        courseId
      },{
        type: 'theory',
        topicId: topics[0][2].id,
        order: 1,
        courseId
      },{
        type: 'exercise',
        topicId: topics[0][2].id,
        order: 2,
        courseId
      },{
        type: 'exercise',
        topicId: topics[0][2].id,
        order: 3,
        courseId
      }, {
        type: 'theory',
        topicId: topics[0][3].id,
        order: 1,
        courseId
      }, {
        type: 'theory',
        topicId: topics[0][4].id,
        order: 1,
        courseId
      },
    ]);
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
    ]);
    await queryInterface.bulkInsert('exercises', [
      {
        title: 'Exercício A',
        activityId: exercises[0][0].id,
        statement: 'Retorne a soma dos objetos de uma array',
        example: "arr = [1, 3] => soma = 4",
        sampleCode: `function sumArray(array) {
          //Insira seu código aqui
          }`,
        solution: `function sumArray(array) {
          let sum = 0;
          for (let i = 0; i < array.length; i++) {
          sum += array[i];
          }
          return sum;
          }`,
        testCode: `describe("sumArray", () => {
          it("should return the sum of all numbers from the passed array", () => {
            const array = [2,4,6,8,10];
            const result = sumArray(array);
            expect(result).to.equal(30);
          });
          it("should return 0 when passed an empty array", () => {
            const array = [];
            const result = sumArray(array);
            expect(result).to.equal(0);
          });
          it("should return a negative number when the sum is negative", () => {
            const array = [3, -12, 5, 6, -8];
            const result = sumArray(array);
            expect(result).to.equal(-6);
          });
          })`,
      }, {
        title: 'Exercício B',
        activityId: exercises[0][1].id,
        statement: 'Retorne a soma dos objetos de uma array',
        example: "arr = [1, 3] => soma = 4",
        sampleCode: `function sumArray(array) {
          //Insira seu código aqui
          }`,
        solution: `function sumArray(array) {
          let sum = 0;
          for (let i = 0; i < array.length; i++) {
          sum += array[i];
          }
          return sum;
          }`,
        testCode: `describe("sumArray", () => {
          it("should return the sum of all numbers from the passed array", () => {
            const array = [2,4,6,8,10];
            const result = sumArray(array);
            expect(result).to.equal(30);
          });
          it("should return 0 when passed an empty array", () => {
            const array = [];
            const result = sumArray(array);
            expect(result).to.equal(0);
          });
          it("should return a negative number when the sum is negative", () => {
            const array = [3, -12, 5, 6, -8];
            const result = sumArray(array);
            expect(result).to.equal(-6);
          });
          })`,
      }, {
        title: 'Exercício C',
        activityId: exercises[0][2].id,
        statement: 'Retorne a soma dos objetos de uma array',
        example: "arr = [1, 3] => soma = 4",
        sampleCode: `function sumArray(array) {
          //Insira seu código aqui
          }`,
        solution: `function sumArray(array) {
          let sum = 0;
          for (let i = 0; i < array.length; i++) {
          sum += array[i];
          }
          return sum;
          }`,
        testCode: `describe("sumArray", () => {
          it("should return the sum of all numbers from the passed array", () => {
            const array = [2,4,6,8,10];
            const result = sumArray(array);
            expect(result).to.equal(30);
          });
          it("should return 0 when passed an empty array", () => {
            const array = [];
            const result = sumArray(array);
            expect(result).to.equal(0);
          });
          it("should return a negative number when the sum is negative", () => {
            const array = [3, -12, 5, 6, -8];
            const result = sumArray(array);
            expect(result).to.equal(-6);
          });
          })`,
      }, {
        title: 'Exercício D',
        activityId: exercises[0][3].id,
        statement: 'Retorne a soma dos objetos de uma array',
        example: "arr = [1, 3] => soma = 4",
        sampleCode: `function sumArray(array) {
          //Insira seu código aqui
          }`,
        solution: `function sumArray(array) {
          let sum = 0;
          for (let i = 0; i < array.length; i++) {
          sum += array[i];
          }
          return sum;
          }`,
        testCode: `describe("sumArray", () => {
          it("should return the sum of all numbers from the passed array", () => {
            const array = [2,4,6,8,10];
            const result = sumArray(array);
            expect(result).to.equal(30);
          });
          it("should return 0 when passed an empty array", () => {
            const array = [];
            const result = sumArray(array);
            expect(result).to.equal(0);
          });
          it("should return a negative number when the sum is negative", () => {
            const array = [3, -12, 5, 6, -8];
            const result = sumArray(array);
            expect(result).to.equal(-6);
          });
          })`,
      }, {
        title: 'Exercício E',
        activityId: exercises[0][4].id,
        statement: 'Retorne a soma dos objetos de uma array',
        example: "arr = [1, 3] => soma = 4",
        sampleCode: `function sumArray(array) {
          //Insira seu código aqui
          }`,
        solution: `function sumArray(array) {
          let sum = 0;
          for (let i = 0; i < array.length; i++) {
          sum += array[i];
          }
          return sum;
          }`,
        testCode: `describe("sumArray", () => {
          it("should return the sum of all numbers from the passed array", () => {
            const array = [2,4,6,8,10];
            const result = sumArray(array);
            expect(result).to.equal(30);
          });
          it("should return 0 when passed an empty array", () => {
            const array = [];
            const result = sumArray(array);
            expect(result).to.equal(0);
          });
          it("should return a negative number when the sum is negative", () => {
            const array = [3, -12, 5, 6, -8];
            const result = sumArray(array);
            expect(result).to.equal(-6);
          });
          })`,
      }, {
        title: 'Exercício F',
        activityId: exercises[0][5].id,
        statement: 'Retorne a soma dos objetos de uma array',
        example: "arr = [1, 3] => soma = 4",
        sampleCode: `function sumArray(array) {
          //Insira seu código aqui
          }`,
        solution: `function sumArray(array) {
          let sum = 0;
          for (let i = 0; i < array.length; i++) {
          sum += array[i];
          }
          return sum;
          }`,
        testCode: `describe("sumArray", () => {
          it("should return the sum of all numbers from the passed array", () => {
            const array = [2,4,6,8,10];
            const result = sumArray(array);
            expect(result).to.equal(30);
          });
          it("should return 0 when passed an empty array", () => {
            const array = [];
            const result = sumArray(array);
            expect(result).to.equal(0);
          });
          it("should return a negative number when the sum is negative", () => {
            const array = [3, -12, 5, 6, -8];
            const result = sumArray(array);
            expect(result).to.equal(-6);
          });
          })`,
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    const topics = await queryInterface.sequelize.query(
      'SELECT id FROM topics;'
    );
    const theories = await queryInterface.sequelize.query(
      `SELECT id FROM activities WHERE type='theory';`
    );
    const exercises = await queryInterface.sequelize.query(
      `SELECT id FROM activities WHERE type='exercise';`
    );
    await queryInterface.bulkDelete('exercises', { activityId: exercises[0][0].id });
    await queryInterface.bulkDelete('exercises', { activityId: exercises[0][1].id });
    await queryInterface.bulkDelete('exercises', { activityId: exercises[0][2].id });
    await queryInterface.bulkDelete('exercises', { activityId: exercises[0][3].id });
    await queryInterface.bulkDelete('exercises', { activityId: exercises[0][4].id });
    await queryInterface.bulkDelete('exercises', { activityId: exercises[0][5].id });

    await queryInterface.bulkDelete('theories', { activityId: theories[0][0].id });
    await queryInterface.bulkDelete('theories', { activityId: theories[0][1].id });
    await queryInterface.bulkDelete('theories', { activityId: theories[0][2].id });
    await queryInterface.bulkDelete('theories', { activityId: theories[0][3].id });
    await queryInterface.bulkDelete('theories', { activityId: theories[0][4].id });
    
    await queryInterface.bulkDelete('activities', { topicId: topics[0][0].id });
    await queryInterface.bulkDelete('activities', { topicId: topics[0][1].id });
    await queryInterface.bulkDelete('activities', { topicId: topics[0][2].id });
    await queryInterface.bulkDelete('activities', { topicId: topics[0][3].id });
    await queryInterface.bulkDelete('activities', { topicId: topics[0][4].id });
  }
};
