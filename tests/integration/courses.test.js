/* global beforeEach, afterAll, it, describe, expect */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const { Pool } = require('pg');
const supertest = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/utils/database');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function getToken (user) {
  const { id, email, name } = user;
  const userToSign = { id, email, name };
  const token = jwt.sign(userToSign, process.env.SECRET);
  return token;
}

beforeEach(async () => {
  await db.query('DELETE FROM users');
  await db.query('DELETE FROM courses');
});

afterAll(async () => {
  await sequelize.close();
  await db.end();
});

describe('GET /courses/suggestions', () => {
  let user = {};
  let courses = [];

  beforeEach(async () => {
    const userValues = ['test@test.com', '123456', 'Test'];
    const courseValues = ['Test title', 'Test description', 'Test photo', 'Test alt', 'Test background'];

    const dbUser = await db.query(`INSERT INTO users (email, password, name)
      VALUES ($1, $2, $3) RETURNING *`, userValues);
    const dbCourse = await db.query(`INSERT INTO courses (title, description, photo, alt, background)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`, courseValues);

    [user] = dbUser.rows;
    courses = dbCourse.rows;
  });

  it('should return 401 when cookie is invalid', async () => {
    const token = 'wrong_token';
    const response = await agent.get('/courses/suggestions').set('Cookie', `token=${token}`);
    expect(response.status).toBe(401);
    expect(response.text).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.get('/courses/suggestions');
    expect(response.status).toBe(401);
    expect(response.text).toEqual('Token não encontrado');
  });

  it('should return 200 when requested with valid cookie', async () => {
    const token = getToken(user);
    const response = await agent.get('/courses/suggestions').set('Cookie', `token=${token}`);
    expect(response.status).toBe(200);
  });

  it('should return an array when called', async () => {
    const token = getToken(user);
    const response = await agent.get('/courses/suggestions').set('Cookie', `token=${token}`);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(courses[0]),
      ]),
    );
  });
});

// describe('GET /courses/:id', () => {
//   let user = {};
//   let courses = [];
//   let chapters = [];
//   let topics = [];
//   let activities = [];

//   beforeEach(async () => {
//     const userValues = ['test@test.com', '123456', 'Test'];
//     const courseValues = ['Test title', 'Test description', 'Test photo', 'Test alt', 'Test background'];
//     const chapterValues = ['chapter title', 1];
//     const topicsValues = ['topic title', 1];
//     const activitiesValues = ['theory','activity title', 1];

//     const dbUser = await db.query(`INSERT INTO users (email, password, name)
//       VALUES ($1, $2, $3) RETURNING *`, userValues);
//       const dbCourse = await db.query(`INSERT INTO courses (title, description, photo, alt, background)
//       VALUES ($1, $2, $3, $4, $5) RETURNING *`, courseValues);
//     const dbChapter = await db.query(`INSERT INTO chapters (title, "courseId")
//       VALUES ($1, $2) RETURNING *`, chapterValues);
//     const dbTopics = await db.query(`INSERT INTO topics (title, "chapterId")
//     VALUES ($1, $2) RETURNING *`, topicsValues);
//     const dbActivities = await db.query(`INSERT INTO activities (type , "topicId")
//     VALUES ($1, $2) RETURNING *`, activitiesValues);

//     [user] = dbUser.rows;
//     courses = dbCourse.rows;
//     chapters = dbChapter.rows;
//     topics = dbTopics.rows;
//     activities = dbActivities.rows;
//   });

//   it('should return 401 when cookie is invalid', async () => {
//     const token = 'wrong_token';
//     console.log(token);
//     const response = await agent.get('/courses/suggestions').set('Cookie', `token=${token}`);
//     expect(response.status).toBe(401);
//   });

//   it('should return 401 when no cookie is sent', async () => {
//     const response = await agent.get('/courses/suggestions');
//     expect(response.status).toBe(401);
//   });

//   it('should return 200 when requested with valid cookie', async () => {
//     const token = getToken(user);
//     const response = await agent.get('/courses/1').set('Cookie', `token=${token}`);
//     expect(response.status).toBe(200);
//   });

//   it('should return an array when called', async () => {
//     const token = getToken(user);
//     const response = await agent.get('/courses/1').set('Cookie', `token=${token}`);
//     expect(response.body).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining(courses[0]),
//       ]),
//     );
//   });
// });
