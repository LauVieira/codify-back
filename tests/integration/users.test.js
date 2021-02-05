/* global afterAll, jest, describe, it, expect  */
/* eslint-disable no-undef */
require('dotenv').config();
const { Pool } = require('pg');
const supertest = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/utils/database');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function cleanDataBase () {
  await db.query('DELETE FROM users');
}
beforeAll(async () => {
  await cleanDataBase();
});
afterAll(async () => {
  await cleanDataBase();
  await sequelize.close();
  await db.end();
});

jest.mock('bcrypt', () => ({
    hashSync: (password) => password,
    compareSync: (password, hashedPassword) => true,
}));

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
  });
});

describe('POST /users/sign-in', () => {
    it('should return 200 when passed valid parameters', async () => {
      const body = {
        email: 'test@test.com',
        password: '123456',
      };
      const response = await agent.post('/users/sign-in').send(body);
      expect(response.status).toBe(200);
    });
    it('should return 422 when passed missing parameters', async () => {
      const body = {
        email: 'test@test.com',
      };
      const response = await agent.post('/users/sign-in').send(body);
      expect(response.status).toBe(422);
    });
    it('should return 404 when email not found', async () => {
      const body = {
        email: 'unexistingEmail@test.com',
        password: '123456',
      };
      const response = await agent.post('/users/sign-in').send(body);
      expect(response.status).toBe(404);
    })
})