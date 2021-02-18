/* global afterAll, jest, describe, it, expect  */
/* eslint-disable quotes*/
require('dotenv').config();

const supertest = require('supertest');
const app = require('../../src/app');
const agent = supertest(app);

const sequelize = require('../../src/utils/database');

const { eraseDatabase, createUser, createToken } = require('../Helpers');

beforeEach(async () => {
  await eraseDatabase();
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

    await createUser();
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
    
    await createUser();
    
    const response = await agent.post('/users/sign-in').send(body);

    expect(response.headers).toHaveProperty('set-cookie');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      email: body.email,
      name: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    }));
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

    await createUser();

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
    const user = await createUser();
    const token = await createToken(user);

    const response = await agent.post('/users/sign-out').set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Sign-out efetuado com sucesso');
    expect(response.headers['set-cookie'][0]).toContain('Expires');
  });
});
