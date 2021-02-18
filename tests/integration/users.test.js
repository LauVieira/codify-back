/* global afterAll, jest, describe, it, expect  */
require('dotenv').config();
const bcrypt = require('bcrypt');

const supertest = require('supertest');
const app = require('../../src/app');
const agent = supertest(app);

const { Pool } = require('pg');
const sequelize = require('../../src/utils/database');
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function cleanDataBase () {
  await db.query('DELETE FROM users');
}

beforeEach(async () => {
  await cleanDataBase();
});

afterAll(async () => {
  await sequelize.close();
  await db.end();
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
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
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

    await db.query('INSERT INTO users (name, email, password) values ($1, $2, $3)', [body.name, body.email, body.password]);
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
    const password = bcrypt.hashSync(body.password, 10);

    await db.query('INSERT INTO users (name, email, password) values ($1, $2, $3)', ['teste', body.email, password]);
    
    const response = await agent.post('/users/sign-in').send(body);

    expect(response.headers).toHaveProperty('set-cookie');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      email: body.email,
      name: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
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

    const password = bcrypt.hashSync('123456', 10);

    await db.query('INSERT INTO users (name, email, password) values ($1, $2, $3)', ['teste', body.email, password]);

    const response = await agent.post('/users/sign-in').send(body);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Email ou senha estão incorretos');
  });
});
