const dotenv = require('dotenv');

dotenv.config();
const { Pool } = require('pg');
const supertest = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/utils/database');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

afterAll(async () => {
  await sequelize.close();
  await db.end();
});

jest.mock('bcrypt', () => ({
  hashSync: (password) => password,
  compareSync: (password, hashedPassword) => true,
}));

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
  });
});
