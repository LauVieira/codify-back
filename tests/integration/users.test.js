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
  await cleanDataBase();
  await sequelize.close();
  await db.end();
});

jest.mock('bcrypt');

describe('POST /users/sign-up', () => {
  it('should return 201 when passed valid parameters', async () => {
    const body = {
      name: 'test',
      email: 'test@test.com',
      password: '1Ju23123',
      confirmPassword: '1Ju23123',
    };

    bcrypt.hashSync.mockImplementationOnce((password) => password);

    const response = await agent.post('/users/sign-up').send(body);
    const queryResult = await db.query('SELECT * FROM users WHERE email=$1', [body.email]);
    const user = queryResult.rows[0];

    expect(response.status).toBe(201);
    expect(user).toEqual(expect.objectContaining({
      email: body.email,
      name: body.name
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
    expect(response.text).toEqual('Não foi possível processar o formato dos dados');
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
    expect(response.text).toEqual('Email selecionado já existe na plataforma');
  });
});

describe('POST /users/sign-in', () => {
  it('should return 200 when passed valid parameters', async () => {
    const body = {
      email: 'test@test.com',
      password: '123456',
    };

    bcrypt.compareSync.mockImplementationOnce(() => true);
    
    await db.query('INSERT INTO users (name, email, password) values ($1, $2, $3)', ['teste', body.email, body.password]);
    
    const response = await agent.post('/users/sign-in').send(body);

    const queryResult = await db.query('SELECT * FROM users WHERE email=$1', [body.email]);
    const user = queryResult.rows[0];

    expect(response.headers).toHaveProperty('set-cookie');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      id: user.id,
      email: user.email,
      name: user.name
    }));
  });

  it('should return 422 when passed missing parameters', async () => {
    const body = {
      email: 'test@test.com',
    };

    const response = await agent.post('/users/sign-in').send(body);
    expect(response.status).toBe(422);
    expect(response.text).toEqual('Não foi possível processar o formato dos dados');
  });

  it('should return 401 when email is wrong', async () => {
    const body = {
      email: 'unexistingEmail@test.com',
      password: '1Ju23123',
    };

    const response = await agent.post('/users/sign-in').send(body);

    expect(response.status).toBe(401);
    expect(response.text).toEqual('Email ou senha estão incorretos');
  });

  it('should return 401 when password is wrong', async () => {
    const body = {
      email: 'test@test.com',
      password: '1Ju23123xxx',
    };

    bcrypt.compareSync.mockImplementationOnce(() => false);

    await db.query('INSERT INTO users (name, email, password) values ($1, $2, $3)', ['teste', body.email, '1Ju23123']);

    const response = await agent.post('/users/sign-in').send(body);

    expect(response.status).toBe(401);
    expect(response.text).toEqual('Email ou senha estão incorretos');
  });
});
