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

  it('should return the array expected with valid cookie', async () => {
    const course = await Helpers.createCourse();
    const response = await agent.get('/courses/suggestions').set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(course),
      ]),
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

  it('should return 200 with the courses expected and a valid cookie', async () => {
    const course = await Helpers.createCourse();
    const chapter = await Helpers.createChapter(course.id);
    const topic = await Helpers.createTopic(chapter.id);
    const { activityTh } = await Helpers.createActivityTheory(topic.id);
    const { activityEx } = await Helpers.createActivityExercise(topic.id);

    const response = await agent.get(`/courses/${course.id}`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      course: expect.objectContaining(course),
      program: expect.arrayContaining([expect.objectContaining({
        ...chapter,
        topics: expect.arrayContaining([expect.objectContaining({
          ...topic,
          activities: expect.arrayContaining([
            expect.objectContaining(activityTh),
            expect.objectContaining(activityEx)
          ])
        })])
      })])
    }));
  });
});

describe('GET /courses/chapters/:chapterId/topics/:id/activities', () => {
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
    const { activityTh, theory } = await Helpers.createActivityTheory(topic.id);
    const { activityEx, exercise } = await Helpers.createActivityExercise(topic.id);
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

describe('POST /courses/activities/:id', () => {
  let token, activityTh, user, activityUser;

  beforeEach(async () => {
    user = await Helpers.createUser();
    token = await Helpers.createToken(user);
    const course = await Helpers.createCourse();
    const chapter = await Helpers.createChapter(course.id);
    const topic = await Helpers.createTopic(chapter.id);
    activityTh = (await Helpers.createActivityTheory(topic.id)).activityTh;
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongToken = 'wrong_token';
    const response = await agent.post('/courses/activities/0').set('Cookie', `token=${wrongToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.post('/courses/activities/0');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 404 when activity id is not found', async () => {
    const response = await agent.post('/courses/activities/0').set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Atividade não encontrada');
  });

  it('should return the activity completed when dont exist in DB', async () => {
    const response = await agent.post(`/courses/activities/${activityTh.id}`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      userId: user.id,
      activityId: activityTh.id,
      done: true,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    }));
  });

  it('should return the activity done equal to false', async () => {
    activityUser = await Helpers.createActivityUsers(user.id, activityTh.id);

    const response = await agent.post(`/courses/activities/${activityTh.id}`).set('Cookie', `token=${token}`);

    delete activityUser.done;
    delete activityUser.updatedAt;

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining({
      ...activityUser,
      done: false,
      updatedAt: expect.any(String),
    }));
  });
});

describe('POST /courses/:id', () => {
  let token, user;

  beforeEach(async () => {
    user = await Helpers.createUser();
    token = await Helpers.createToken(user);
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongToken = 'wrong_token';
    const response = await agent.post('/courses/0').set('Cookie', `token=${wrongToken}`);
  
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });
  
  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.post('/courses/0');
  
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 404 when course id is not found', async () => {
    const response = await agent.post(`/courses/0`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Curso não encontrado');
  });

  it('should return 409 when CourseUser is already created', async () => {
    const course = await Helpers.createCourse();
    await Helpers.createCourseUsers(user.id, course.id);

    const response = await agent.post(`/courses/${course.id}`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(409);
    expect(response.body.message).toEqual('Curso já foi inicializado');
  });

  it('should return 200 with the courses expected and a valid cookie', async () => {
    const course = await Helpers.createCourse();

    const response = await agent.post(`/courses/${course.id}`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        courseUser: expect.objectContaining({
          id: expect.any(Number),
          courseId: course.id,
          userId: user.id,
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        }),
        user: expect.objectContaining({
          id: user.id,
          name: user.name,
          email: user.email,
          lastCourse: course.id,
          updatedAt: expect.any(String),
          createdAt: user.createdAt
        })
      })
    );
  });
});
