/* global afterAll, jest, describe, it, expect  */
/* eslint-disable quotes*/
require('dotenv-flow').config({ silent: true });
const jwt = require('jsonwebtoken');

const app = require('../../src/app');
const supertest = require('supertest');
const agent = supertest(app);

const sequelize = require('../../src/utils/database');
const { Pool } = require('pg');
const db = new Pool({
    connectionString: process.env.DATABASE_URL
});

const redis = require('../../src/utils/redis');

const Helpers = require('../Helpers');

beforeEach(async () => {
  await Helpers.eraseDatabase();
});

afterAll(async () => {
  await sequelize.close();
  await db.end();
  await redis.endConnection();
});

describe('GET /admin/courses/', () => {
  let courses = [];
  let adminToken = '';

  beforeEach(async () => {
    const courseValues = ['Test title', 'Test description', 'Test photo', 'Test alt', 'Test background'];
    const adminValues = ['admin', '1Ju23123'];

    const dbCourse = await db.query(`INSERT INTO courses 
      (title, description, photo, alt, background)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`, 
    courseValues);
    const admin = 
      await db.query('INSERT INTO admins (username, password) values ($1, $2) RETURNING *', 
      adminValues
    );

    courses = dbCourse.rows;

    courses[0].createdAt = courses[0].createdAt.toJSON();
    courses[0].updatedAt = courses[0].updatedAt.toJSON();

    adminToken = jwt.sign(admin.rows[0], process.env.ADMIN_SECRET);
    await redis.setSession(adminToken, admin.rows[0].username);
  });

  afterEach(async () => {
    await db.query(`DELETE FROM courses WHERE title = 'Test title'`);

    courses = [];
  });

  it('should return 401 when cookie is invalid', async () => {
    const response = await agent.get('/admin/courses/').set('Cookie', `adminToken=wrong_token`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return an array with courses when called with proper token', async () => {
    const response = await agent.get('/admin/courses/').set('Cookie', `adminToken=${adminToken}`);

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
  let adminToken = '';

  beforeEach(async () => {
    const adminValues = ['admin', '1Ju23123'];

    const admin = 
      await db.query('INSERT INTO admins (username, password) values ($1, $2) RETURNING *', 
      adminValues
    );

    adminToken = jwt.sign(admin.rows[0], process.env.ADMIN_SECRET);
    await redis.setSession(adminToken, admin.rows[0].username);
  });

  afterEach(async () => {
    await db.query(`DELETE FROM courses WHERE title = 'Test title'`);
  });

  it('should return an object like body when called with right parameters and status 201', async () => {
    const response = await agent.post('/admin/courses/').send(body).set('Cookie', `adminToken=${adminToken}`);

    expect(response.body).toEqual(
      expect.objectContaining(body)
    );
    expect(response.status).toBe(201);
  });

  it('should status 401 when called with no cookie', async () => {
    const response = await agent.post('/admin/courses/').send(body);

    expect(response.status).toBe(401);
  });

  it('should return 422 when called with wrong parameters', async () => {
    const wrongBody = { ...body };
    wrongBody.title = 111;
    const response = await agent.post('/admin/courses/').send(wrongBody).set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(422);
  });
});

describe('PUT /admin/courses/:id', () => {
  let courses = [];
  let adminToken = '';
  let courseId = -1;
  let newBody = {
    alt: 'Test alt',
    background: 'Test background',
    description: 'Test description',
    photo: 'Test photo',
    title: 'New test title',
  };

  beforeEach(async () => {
    const courseValues = ['Test title', 'Test description', 'Test photo', 'Test alt', 'Test background'];
    const adminValues = ['admin', '1Ju23123'];

    const dbCourse = await db.query(`INSERT INTO courses 
      (title, description, photo, alt, background)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`, 
    courseValues);
    const admin = 
      await db.query('INSERT INTO admins (username, password) values ($1, $2) RETURNING *', 
      adminValues
    );

    courses = dbCourse.rows;
    courses[0].createdAt = courses[0].createdAt.toJSON();
    courses[0].updatedAt = courses[0].updatedAt.toJSON();

    courseId = dbCourse.rows[0].id;
    adminToken = jwt.sign(admin.rows[0], process.env.ADMIN_SECRET);
    await redis.setSession(adminToken, admin.rows[0].username);
  });

  afterEach(async () => {
    await db.query(`DELETE FROM courses WHERE title = 'Test title'`);

    courses = [];
    courseId = -1;
  });

  it('should return 401 when cookie is invalid', async () => {
    const response = await agent.put(`/admin/courses/${courseId}`).send(newBody).set('Cookie', `adminToken=wrong_token`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return an obj with like newBody when called with proper token', async () => {
    const response = await agent.put(`/admin/courses/${courseId}`).send(newBody).set('Cookie', `adminToken=${adminToken}`);

    expect(response.body).toEqual(
      expect.objectContaining(newBody),
    );
  });

  it('should return 422 when called with invalid course data', async () => {
    const response = await agent.put(`/admin/courses/${courseId}`).send({ data: 'invalid' }).set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(422);
  });
});
