/* global beforeEach, afterAll, it, describe, expect */

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const { Pool } = require('pg');
const supertest = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/utils/database');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function getToken(user) {
  const { id, email, name } = user;
  const userToSign = { id, email, name };
  const token = jwt.sign(userToSign, process.env.SECRET);
  return token;
}

beforeEach(async () => {
  await db.query('DELETE FROM users');
});

afterAll(async () => {
  await sequelize.close();
  await db.end();
});

describe('GET /courses', () => {
  let user = {};

  beforeEach(async () => {
    const values = ['test@test.com', '123456', 'Test'];
    const dbUser = await db.query(`INSERT INTO users (email, password, name)
      VALUES ($1, $2, $3) RETURNING *`, values);
    [user] = dbUser.rows;
  });

  it('should return 200 when requested with valid cookie', async () => {
    const token = getToken(user);
    const response = await agent.get('/courses').set('Cookie', `token=${token}`);
    expect(response.status).toBe(200);
  });

  it('should return 401 when cookie is invalid', async () => {
    const token = 'lalala';
    const response = await agent.get('/courses').set('Cookie', `token=${token}`);
    expect(response.status).toBe(401);
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.get('/courses');
    expect(response.status).toBe(401);
  });
});
