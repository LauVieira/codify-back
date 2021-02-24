/* global afterAll, jest, describe, it, expect  */
/* eslint-disable quotes*/
require('dotenv-flow').config({ silent: true });

const supertest = require('supertest');
const app = require('../../src/app');
const agent = supertest(app);

const sequelize = require('../../src/utils/database');
const redis = require('promise-redis')();
const client = redis.createClient({
  url: process.env.REDISCLOUD_URL
});

const Helpers = require('../Helpers');

beforeEach(async () => {
  await Helpers.eraseDatabase();
});

afterAll(async () => {
  await sequelize.close();
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

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Sign-out efetuado com sucesso');
    expect(response.headers['set-cookie'][0]).toContain('Expires');
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

  it('should return the chapter updated with valid cookie', async () =>{
    const body = { name: 'novo nome', email: 'novoemail@gmail.com' };

    const response = await agent.put(`/users/${user.id}`).send(body).set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).toEqual(expect.objectContaining({
      id: user.id,
      name: body.name,
      email: body.email,
      createdAt: user.createdAt,
      updatedAt: expect.any(String),
    }));
  });
});
