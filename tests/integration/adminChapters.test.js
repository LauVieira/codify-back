/* global afterAll, jest, describe, it, expect  */
require('dotenv-flow').config();

const app = require('../../src/app');
const supertest = require('supertest');
const agent = supertest(app);

const sequelize = require('../../src/utils/database');

const Helpers = require('../Helpers');

beforeEach(async () => {
  await Helpers.eraseDatabase();
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /admin/chapters/:id', () => {
  let admin, adminToken;

  beforeEach(async () => {
    admin = await Helpers.createAdmin();
    adminToken = await Helpers.createAdminToken(admin);
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongAdminToken = 'wrong_token';
    const response = await agent.get('/admin/chapters/0').set('Cookie', `adminToken=${wrongAdminToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.get('/admin/chapters/0');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 404 when chapter id is not found', async () => {
    const response = await agent.get('/admin/chapters/0').set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Capítulo não encontrado');
  });

  it('should return one chapter with the especific id and valid cookie', async () =>{
    const course = await Helpers.createCourse();
    const chapter = await Helpers.createChapter(course.id);

    const response = await agent.get(`/admin/chapters/${chapter.id}`).set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(chapter);
  });
});

describe('POST /admin/chapters', () => {
  let admin, adminToken, course;

  beforeEach(async () => {
    admin = await Helpers.createAdmin();
    adminToken = await Helpers.createAdminToken(admin);
    course = await Helpers.createCourse();
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongAdminToken = 'wrong_token';
    const response = await agent.post('/admin/chapters').set('Cookie', `adminToken=${wrongAdminToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.post('/admin/chapters');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 422 when called with invalid chapter data', async () => {
    const body = { title: 'title chapter' };
    const response = await agent.post('/admin/chapters').send(body).set('Cookie', `adminToken=${adminToken}`);
  
    expect(response.status).toBe(422);
    expect(response.body.message).toEqual('Não foi possível processar o formato dos dados');
  });

  it('should return 404 when courseId is not associate to any course in DB', async () => {
    const body = { title: 'title chapter', courseId: 0 };
    const response = await agent.post('/admin/chapters').send(body).set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Curso não encontrado');
  });

  it('should return the chapter created with valid cookie', async () =>{
    const body = { title: 'title chapter', courseId: course.id };

    const response = await agent.post('/admin/chapters').send(body).set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: body.title,
      courseId: body.courseId,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    }));
  });
});
