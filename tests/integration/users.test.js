/* global afterAll, jest, describe, it, expect  */
/* eslint-disable quotes*/
require('dotenv-flow').config({ silent: true });
const uuid = require('uuid');
const nock = require('nock');

const supertest = require('supertest');
const app = require('../../src/app');
const agent = supertest(app);

const sequelize = require('../../src/utils/database');

const Helpers = require('../Helpers');

const redis = require('../../src/utils/redis');

beforeEach(async () => {
  await Helpers.eraseDatabase();
});

afterAll(async () => {
  await Helpers.eraseDatabase();
  await sequelize.close();
  await redis.endConnection();
});

describe('POST /users/sign-up', () => {
  it('should return 201 when passed valid parameters', async () => {
    const body = {
      name: 'test',
      email: 'test@test.com',
      password: '1Ju23123',
      confirmPassword: '1Ju23123',
    };

    const response = await agent.post('/users/sign-up').send(body);

    expect(response.status).toBe(201);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      email: body.email,
      name: body.name,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    }));
  });

  it('should return 422 when passed invalid parameters', async () => {
    const body = {
      name: 'test',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '1234567',
    };

    const response = await agent.post('/users/sign-up').send(body);

    expect(response.status).toBe(422);
    expect(response.body.message).toEqual('Não foi possível processar o formato dos dados');
  });
  
  it('should return 409 when email already exists', async () => {
    const body = {
      name: 'test',
      email: 'test@test.com',
      password: '1Ju23123',
      confirmPassword: '1Ju23123',
    };

    await Helpers.createUser();
    const response = await agent.post('/users/sign-up').send(body);

    expect(response.status).toBe(409);
    expect(response.body.message).toEqual('Email selecionado já existe na plataforma');
  });
});

describe('POST /users/sign-in', () => {
  it('should return 200 when passed valid parameters', async () => {
    const body = {
      email: 'test@test.com',
      password: '123456',
    };
    
    const user = await Helpers.createUser();
    delete user.password;
    
    const response = await agent.post('/users/sign-in').send(body);

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie'][0]).toContain('token');
    expect(response.body).toMatchObject(user);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 422 when passed missing parameters', async () => {
    const body = {
      email: 'test@test.com',
    };

    const response = await agent.post('/users/sign-in').send(body);
    expect(response.status).toBe(422);
    expect(response.body.message).toEqual('Não foi possível processar o formato dos dados');
  });

  it('should return 401 when email is wrong', async () => {
    const body = {
      email: 'unexistingEmail@test.com',
      password: '1Ju23123',
    };

    const response = await agent.post('/users/sign-in').send(body);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Email ou senha estão incorretos');
  });

  it('should return 401 when password is wrong', async () => {
    const body = {
      email: 'test@test.com',
      password: '1Ju23123xxx',
    };

    await Helpers.createUser();

    const response = await agent.post('/users/sign-in').send(body);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Email ou senha estão incorretos');
  });
});

describe('POST /users/sign-out', () => {
  it('should return 401 when token cookie is invalid', async () => {
    const token = 'wrong_token';
    const response = await agent.post('/users/sign-out').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.post('/users/sign-out');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 200 -> valid cookie, and destroy session', async () => {
    const user = await Helpers.createUser();
    const token = await Helpers.createToken(user);

    const response = await agent.post('/users/sign-out').set('Cookie', `token=${token}`);

    const session = await redis.getSession(token);

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie'][0]).toContain('Expires');
    expect(session).toBeFalsy();
  });
});

describe('PUT /users/:id', () => {
  let user, token;

  beforeEach(async () => {
    user = await Helpers.createUser();
    token = await Helpers.createToken(user);
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongToken = 'wrong_token';
    const response = await agent.put('/users/0').set('Cookie', `token=${wrongToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.put('/users/0');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 422 when called with invalid topic data', async () => {
    const body = { data: 'invalid' };
    const response = await agent.put('/users/0').send(body).set('Cookie', `token=${token}`);
  
    expect(response.status).toBe(422);
    expect(response.body.message).toEqual('Não foi possível processar o formato dos dados');
  });

  it('should return 404 when user id is not found', async () => {
    const body = { name: 'novo nome', email: 'novoemail@gmail.com' };
    const response = await agent.put(`/users/0`).send(body).set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Usuário não encontrado');
  });

  it('should return the user updated with valid cookie', async () =>{
    const body = { name: 'novo nome', email: 'novoemail@gmail.com' };

    const passwordBefore = await sequelize.query(`SELECT password FROM users WHERE id=${user.id}`);

    const response = await agent.put(`/users/${user.id}`).send(body).set('Cookie', `token=${token}`);

    const passwordAfter = await sequelize.query(`SELECT password FROM users WHERE id=${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('password');
    expect(passwordBefore[0][0].password).toEqual(passwordAfter[0][0].password);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: user.id,
        name: body.name,
        email: body.email,
        createdAt: user.createdAt,
        updatedAt: expect.any(String),
      })
    );
  });

  it('should return the user updated with valid cookie and change the password', async () =>{
    const body = { 
      name: 'novo nome', 
      email: 'novoemail@gmail.com',
      password: 'novasenha123',
      confirmPassword: 'novasenha123',
    };

    const passwordBefore = await sequelize.query(`SELECT password FROM users WHERE id=${user.id}`);

    const response = await agent.put(`/users/${user.id}`).send(body).set('Cookie', `token=${token}`);

    const passwordAfter = await sequelize.query(`SELECT password FROM users WHERE id=${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('password');
    expect(passwordBefore[0][0].password).not.toEqual(passwordAfter[0][0].password);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: user.id,
        name: body.name,
        email: body.email,
        createdAt: user.createdAt,
        updatedAt: expect.any(String),
      })
    );
  });
});

describe('POST /users/redefine-password', () => {
  it('should return 422 when called with wrong body uuid', async () => {
    const body = { password: '123456789', confirmPassword: '123456789', token: 'aa' };

    const response = await agent.post('/users/redefine-password').send(body);
  
    expect(response.status).toBe(422);
    expect(response.body.message).toEqual('Não foi possível processar o formato dos dados');
  });

  it('should return 403 when called with token expire or invalid', async () => {
    const body = { password: '123456789', confirmPassword: '123456789', token: uuid.v4() };

    const response = await agent.post('/users/redefine-password').send(body);
  
    expect(response.status).toBe(403);
    expect(response.body.message).toEqual('Token inválido ou expirado');
  });

  it('should return 200 and change the password', async () => {
    const user = await Helpers.createUser();
    const token = await redis.setItem(user.id);

    const body = { password: '123456789', confirmPassword: '123456789', token };

    const passwordBefore = await sequelize.query(`SELECT password FROM users WHERE id=${user.id}`);

    const response = await agent.post('/users/redefine-password').send(body);

    const passwordAfter = await sequelize.query(`SELECT password FROM users WHERE id=${user.id}`);

    expect(response.status).toBe(200);
    expect(passwordBefore[0][0].password).not.toEqual(passwordAfter[0][0].password);
  });
});

describe('POST /users/forgot-password', () => {
  it('should return 422 when called with wrong email format', async () => {
    const body = { email: 'email' };

    const response = await agent.post('/users/forgot-password').send(body);
  
    expect(response.status).toBe(422);
    expect(response.body.message).toEqual('Não foi possível processar o formato dos dados');
  });

  it('should return 202 when called with email that dont have in DB -> not send email', async () => {
    const body = { email: 'email@email.com' };

    const response = await agent.post('/users/forgot-password').send(body);
  
    expect(response.status).toBe(202);
  });

  it('should return 202 and send email to the receiver', async () => {
    const user = await Helpers.createUser('gabriell.mil@gmail.com');
    nock('https://api.sendgrid.com').post('/v3/mail/send').reply(200, 'OK');
    const body = { email: user.email };

    const response = await agent.post('/users/forgot-password').send(body);
  
    expect(response.status).toBe(202);
  });
});

describe('POST /users/initialize-course/:id', () => {
  let token, user;

  beforeEach(async () => {
    user = await Helpers.createUser();
    token = await Helpers.createToken(user);
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongToken = 'wrong_token';
    const response = await agent.post('/users/initialize-course/0').set('Cookie', `token=${wrongToken}`);
  
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });
  
  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.post('/users/initialize-course/0');
  
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 404 when course id is not found', async () => {
    const response = await agent.post(`/users/initialize-course/0`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Curso não encontrado');
  });

  it('should return 200 with the lastCourse updated and course initialized', async () => {
    const course = await Helpers.createCourse();

    const response = await agent.post(`/users/initialize-course/${course.id}`).set('Cookie', `token=${token}`);

    const courseUser = await sequelize.query(`SELECT * FROM "courseUsers" WHERE "courseId"=${course.id} AND "userId"=${user.id}`);

    expect(response.status).toBe(201);
    expect(courseUser[0][0]).toBeTruthy();
    expect(response.body).toEqual(
      expect.objectContaining({
        id: user.id,
        name: user.name,
        email: user.email,
        lastCourse: course.id,
        updatedAt: expect.any(String),
        createdAt: user.createdAt
      })
    );
  });
});

describe('GET /users/return-course/:id', () => {
  let token, activityTh, activityEx ,user, topic, chapter, course;

  beforeEach(async () => {
    user = await Helpers.createUser();
    token = await Helpers.createToken(user);
    course = await Helpers.createCourse();
    chapter = await Helpers.createChapter(course.id);
    topic = await Helpers.createTopic(chapter.id);
    activityTh = (await Helpers.createActivityTheory(topic.id, course.id)).activityTh;
    activityEx = (await Helpers.createActivityExercise(topic.id, course.id)).activityEx;
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongToken = 'wrong_token';
    const response = await agent.get('/users/return-course/0').set('Cookie', `token=${wrongToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.get('/users/return-course/0');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 404 when course id is not found', async () => {
    const response = await agent.get(`/users/return-course/0`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Curso não encontrado');
  });

  it('should return the path ids to return', async () => {
    await Helpers.createActivityUsers(user.id, activityTh.id, course.id);
    await Helpers.createActivityUsers(user.id, activityEx.id, course.id);

    const response = await agent.get(`/users/return-course/${course.id}`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      { 
        activityId: activityEx.id, 
        topicId: topic.id, 
        chapterId: chapter.id,
      }
    );
  });

  it('should return that is not done any activity', async () => {
    const response = await agent.get(`/users/return-course/${course.id}`).set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ firstActivity: true });
  });
});
