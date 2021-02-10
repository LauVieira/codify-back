/* global afterAll, jest, describe, it, expect  */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = require('../../src/app');
const supertest = require('supertest');
const agent = supertest(app);

const sequelize = require('../../src/utils/database');
const { Pool } = require('pg');
const db = new Pool({
    connectionString: process.env.DATABASE_URL
});

afterAll(async () => {
    await sequelize.close();
    await db.end();
});

const username = process.env.ADMIN_USER;
const password = process.env.ADMIN_PASSWORD;

describe('POST /admin/login', () => {
  it('should return 200 when passed valid parameters', async () => {
    const body = { username, password };
    const response = await agent.post('/admin/login').send(body);
      
    expect(response.headers).toHaveProperty('set-cookie');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
        id: expect.any(Number),
        username
    });
  });

  it('should return 422 when passed missing parameters', async () => {
    const body = { username: 'teste' };
    const response = await agent.post('/admin/login').send(body);

    expect(response.status).toBe(422);
    expect(response.text).toEqual('Não foi possível processar os dados enviados');
  });

  it('should return 401 when username does not match in DB', async () => {
    const body = {
      username: 'unexistingUsername',
      password,
    };
    const response = await agent.post('/admin/login').send(body);

    expect(response.status).toBe(401);
    expect(response.text).toEqual('Username ou senha estão incorretos');
  });

  it('should return 401 when username is right, but password is not', async () => {
      const body = {
        username,
        password: '12345678',
      };
      const response = await agent.post('/admin/login').send(body);

      expect(response.status).toBe(401);
      expect(response.text).toEqual('Username ou senha estão incorretos');
  });
});
