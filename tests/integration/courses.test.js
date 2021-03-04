/* global beforeEach, afterAll, it, describe, expect */
/* eslint-disable quotes*/
require('dotenv-flow').config({ silent: true });

const supertest = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/utils/database');

const agent = supertest(app);

const redis = require('../../src/utils/redis');
const Helpers = require('../Helpers');

beforeEach(async () => {
  await Helpers.eraseDatabase();
});

afterAll(async () => {
  await Helpers.eraseDatabase();
  await sequelize.close();
  await redis.endConnection();
});

describe('GET /courses/suggestions', () => {
  let user, token;

  beforeEach(async () => {
    user = await Helpers.createUser();
    token = await Helpers.createToken(user);
  });

  it('should return 401 when cookie is invalid', async () => {
    const token = 'wrong_token';
    const response = await agent.get('/courses/suggestions').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.get('/courses/suggestions');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return the array expected with valid cookie, not initialized courses', async () => {
    const course = await Helpers.createCourse();
    const response = await agent.get('/courses/suggestions').set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(course),
      ]),
    );
  });

  it('should return the array expected with valid cookie, initialized courses', async () => {
    const course = await Helpers.createCourse();
    await Helpers.createCourseUsers(user.id, course.id);

    const response = await agent.get('/courses/suggestions').set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(0);
    expect(response.body).toEqual(
      expect.arrayContaining([]),
    );
  });
});

describe('GET /courses/initialized', () => {
  let user, token;

  beforeEach(async () => {
    user = await Helpers.createUser();
    token = await Helpers.createToken(user);
  });

  it('should return 401 when cookie is invalid', async () => {
    const token = 'wrong_token';
    const response = await agent.get('/courses/initialized').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.get('/courses/initialized');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return the array expected with valid cookie, -> INITIALIZED COURSE', async () => {
    const course = await Helpers.createCourse();
    await Helpers.createCourseUsers(user.id, course.id);
    
    const response = await agent.get('/courses/initialized').set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(course),
      ]),
    );
  });

  it('should return the array expected with valid cookie, -> NOT INITIALIZED COURSE', async () => {
    await Helpers.createCourse();
    
    const response = await agent.get('/courses/initialized').set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(0);
    expect(response.body).toEqual(
      expect.arrayContaining([]),
    );
  });
});

describe('GET /courses/:id', () => {
  let token, user;

  beforeEach(async () => {
    user = await Helpers.createUser();
    token = await Helpers.createToken(user);
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongToken = 'wrong_token';
    const response = await agent.get('/courses/0').set('Cookie', `token=${wrongToken}`);
  
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });
  
  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.get('/courses/0');
  
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 404 when course id is not found', async () => {
    const response = await agent.get(`/courses/0`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Curso não encontrado');
  });

  it('should return 200 with the courses, program and progress', async () => {
    const course = await Helpers.createCourse();
    const chapter = await Helpers.createChapter(course.id);
    const topic = await Helpers.createTopic(chapter.id);
    const { activityTh } = await Helpers.createActivityTheory(topic.id, course.id);
    const { activityEx } = await Helpers.createActivityExercise(topic.id, course.id);
    await Helpers.createActivityUsers(user.id, activityTh.id, course.id);

    const response = await agent.get(`/courses/${course.id}`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      course: expect.objectContaining({
        ...course,
        progress: 50
      }),
      program: expect.arrayContaining([expect.objectContaining({
        ...chapter,
        topics: expect.arrayContaining([expect.objectContaining({
          ...topic,
          done: false,
          activities: expect.arrayContaining([
            expect.objectContaining(activityTh),
            expect.objectContaining(activityEx)
          ])
        })])
      })])
    }));
  });

  it('should return 200 with the courses, program and progress and topic done', async () => {
    const course = await Helpers.createCourse();
    const chapter = await Helpers.createChapter(course.id);
    const topic = await Helpers.createTopic(chapter.id);
    const { activityTh } = await Helpers.createActivityTheory(topic.id, course.id);
    const { activityEx } = await Helpers.createActivityExercise(topic.id, course.id);
    await Helpers.createActivityUsers(user.id, activityTh.id, course.id);
    await Helpers.createActivityUsers(user.id, activityEx.id, course.id);

    const response = await agent.get(`/courses/${course.id}`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      course: expect.objectContaining({
        ...course,
        progress: 100
      }),
      program: expect.arrayContaining([expect.objectContaining({
        ...chapter,
        topics: expect.arrayContaining([expect.objectContaining({
          ...topic,
          done: true,
          activities: expect.arrayContaining([
            expect.objectContaining(activityTh),
            expect.objectContaining(activityEx)
          ])
        })])
      })])
    }));
  });
});

describe('GET /courses/chapters/:chapterId/topics/:topicId/activities', () => {
  let token, course, user, chapter;

  beforeEach(async () => {
    user = await Helpers.createUser();
    token = await Helpers.createToken(user);
    course = await Helpers.createCourse();
    chapter = await Helpers.createChapter(course.id);
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongToken = 'wrong_token';
    const response = await agent.get('/courses/chapters/0/topics/0/activities').set('Cookie', `token=${wrongToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.get('/courses/chapters/0/topics/0/activities');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 404 when chapter id is not found', async () => {
    const response = await agent.get('/courses/chapters/0/topics/0/activities').set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Capítulo não encontrado');
  });

  it('should return 404 when topic id is not found', async () => {
    const response = await agent.get(`/courses/chapters/${chapter.id}/topics/0/activities`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Tópico não encontrado');
  });

  it('should return 200 with the object expected', async () => {
    const topic = await Helpers.createTopic(chapter.id);
    const { activityTh, theory } = await Helpers.createActivityTheory(topic.id, course.id);
    const { activityEx, exercise } = await Helpers.createActivityExercise(topic.id, course.id);
    const activityUser = await Helpers.createActivityUsers(user.id, activityTh.id);
    
    const response = await agent.get(`/courses/chapters/${chapter.id}/topics/${topic.id}/activities`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      topic: expect.objectContaining({
        ...topic,
        activities: expect.arrayContaining([
          expect.objectContaining({
            ...activityTh,
            theory: expect.objectContaining({
              ...theory
            }),
            exercise: null,
            activityUsers: [expect.objectContaining({
              ...activityUser
            })]
          }),
          expect.objectContaining({
            ...activityEx,
            exercise: expect.objectContaining({
              ...exercise
            }),
            theory: null,
            activityUsers: []
          }),
        ])
      }),
      chapter: expect.objectContaining(chapter)
    }));
  });
});

describe('POST /courses/:id/activities/:activityId', () => {
  let token, activityTh, user, course;

  beforeEach(async () => {
    user = await Helpers.createUser();
    token = await Helpers.createToken(user);
    course = await Helpers.createCourse();
    const chapter = await Helpers.createChapter(course.id);
    const topic = await Helpers.createTopic(chapter.id);
    activityTh = (await Helpers.createActivityTheory(topic.id, course.id)).activityTh;
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongToken = 'wrong_token';
    const response = await agent.post('/courses/0/activities/0').set('Cookie', `token=${wrongToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.post('/courses/0/activities/0');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 404 when course id is not found', async () => {
    const response = await agent.post('/courses/0/activities/0').set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Curso não encontrado');
  });

  it('should return 404 when activity id is not found', async () => {
    const response = await agent.post(`/courses/${course.id}/activities/0`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Atividade não encontrada');
  });

  it('should return the activity concluded when dont exist in DB', async () => {
    const response = await agent.post(`/courses/${course.id}/activities/${activityTh.id}`).set('Cookie', `token=${token}`);

    const activityUserDB = await sequelize.query(`SELECT FROM "activityUsers" WHERE "activityId"=${activityTh.id} AND "userId"=${user.id}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ done: true });
    expect(activityUserDB[0][0]).toBeTruthy();
  });

  it('should return the activity not done', async () => {
    const activityUser = await Helpers.createActivityUsers(user.id, activityTh.id, course.id);

    const response = await agent.post(`/courses/${course.id}/activities/${activityTh.id}`).set('Cookie', `token=${token}`);

    const activityUserDB = await sequelize.query(`SELECT FROM "activityUsers" WHERE id=${activityUser.id}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ done: false });
    expect(activityUserDB[0][0]).toBeFalsy();
  });
});

describe('GET /courses/:id/is-initialized', () => {
  let token, user;

  beforeEach(async () => {
    user = await Helpers.createUser();
    token = await Helpers.createToken(user);
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongToken = 'wrong_token';
    const response = await agent.get('/courses/0/is-initialized').set('Cookie', `token=${wrongToken}`);
  
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });
  
  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.get('/courses/0/is-initialized');
  
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 404 when course id is not found', async () => {
    const response = await agent.get('/courses/0/is-initialized').set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Curso não encontrado');
  });

  it('should return 200 and return initialized false', async () => {
    const course = await Helpers.createCourse();

    const response = await agent.get(`/courses/${course.id}/is-initialized`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ initialized: false });
  });

  it('should return 200 and return initialized true', async () => {
    const course = await Helpers.createCourse();
    await Helpers.createCourseUsers(user.id, course.id);

    const response = await agent.get(`/courses/${course.id}/is-initialized`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ initialized: true });
  });
});
