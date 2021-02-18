/* global afterAll, jest, describe, it, expect  */
/* eslint-disable quotes*/
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = require('../../src/app');
const supertest = require('supertest');
const agent = supertest(app);

const sequelize = require('../../src/utils/database');
const { Pool } = require('pg');
const db = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function cleanDataBase () {
  await db.query('DELETE FROM admins');
}

beforeEach(async () => {
  await cleanDataBase();
});

afterAll(async () => {
  await sequelize.close();
  await db.end();
});

describe('POST /admin/users/login', () => {
  it('should return 200 when passed valid parameters', async () => {
    const body = { 
      username: 'testeUsername',
      password: 'testePassword' 
    };
    const password = bcrypt.hashSync(body.password, 10);
    
    await db.query('INSERT INTO admins (username, password) values ($1, $2)', [body.username, password]);
    const response = await agent.post('/admin/users/login').send(body);

    expect(response.headers).toHaveProperty('set-cookie');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      username: body.username,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    }));
  });

  it('should return 422 when passed missing parameters', async () => {
    const body = { username: 'teste' };
    const response = await agent.post('/admin/users/login').send(body);

    expect(response.status).toBe(422);
    expect(response.body.message).toEqual('Não foi possível processar os dados enviados');
  });

  it('should return 401 when username does not match in DB', async () => {
    const body = {
      username: 'unexistingUsername',
      password: '123456'
    };
    const response = await agent.post('/admin/users/login').send(body);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Username ou senha estão incorretos');
  });

  it('should return 401 when username is right, but password is not', async () => {
      const body = {
        username: 'testeUsername',
        password: '1234567890',
      };

      const password = bcrypt.hashSync('123456', 10);
      
      await db.query('INSERT INTO admins (username, password) values ($1, $2)', [body.username, password]);

      const response = await agent.post('/admin/users/login').send(body);

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Username ou senha estão incorretos');
  });
});

describe('POST /admin/users/logout', () => {
  it('should return 401 when cookie is invalid', async () => {
    const adminToken = 'wrong_token';
    const response = await agent.post('/admin/users/logout').set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.post('/admin/users/logout');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 200 -> valid cookie, and destroy session', async () => {
    const admin = await db.query('INSERT INTO admins (username, password) values ($1, $2) RETURNING *', ['admin', '1Ju23123']);
    const adminToken = jwt.sign(admin.rows[0], process.env.ADMIN_SECRET);

    const response = await agent.post('/admin/users/logout').set('Cookie', `adminToken=${adminToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Logout efetuado com sucesso');
    expect(response.headers['set-cookie'][0]).toContain('Expires');
  });
});

describe('GET /admin/courses/', () => {
  let courses = [];

  beforeEach(async () => {
    const courseValues = ['Test title', 'Test description', 'Test photo', 'Test alt', 'Test background'];

    const dbCourse = await db.query(`INSERT INTO courses 
      (title, description, photo, alt, background)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`, 
    courseValues);

    courses = dbCourse.rows;
  });

  afterEach(async () => {
    await db.query(`DELETE FROM courses WHERE title = 'Test title'`);

    courses = [];
  });

  it('should return an array with courses when called', async () => {
    const response = await agent.get('/admin/courses/');

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(courses[0]),
      ]),
    );
  });
});

describe('POST /admin/courses/', () => {
  let body = {
    alt: 'Test alt',
    background: 'Test background',
    description: 'Test description',
    photo: 'Test photo',
    title: 'Test title',
  };

  afterEach(async () => {
    await db.query(`DELETE FROM courses WHERE title = 'Test title'`);
  });

  it('should return an object like body when called with right parameters and status 201', async () => {
    const response = await agent.post('/admin/courses/').send(body);

    expect(response.body).toEqual(body);
    expect(response.status).toBe(201);
  });

  it('should return 422 when called with wrong parameters', async () => {
    const wrongBody = { ...body };
    wrongBody.title = 111;
    const response = await agent.post('/admin/courses/').send(wrongBody);

    expect(response.status).toBe(422);
  });
});
