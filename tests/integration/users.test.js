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
beforeAll(async () => {
  await db.query('DELETE FROM users');
});
afterAll(async () => {
  await db.query('DELETE FROM users;');
  await sequelize.close();
  await db.end();
});
jest.mock('bcrypt', () => ({
  hashSync: (password) => password,
}));
describe('POST /users/sign-up', () => {
  it('should return 201 when passed valid parameters', async () => {
    const body = {
      name: 'test',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
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
      password: '123456',
      confirmPassword: '123456',
    };
    await db.query('INSERT INTO users (name, email, password) values ($1, $2, $3)', [body.name, body.email, body.password]);
    const response = await agent.post('/users/sign-up').send(body);
    console.log(response);
    expect(response.status).toBe(409);
  });
});
