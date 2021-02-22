/* global afterAll, jest, describe, it, expect  */
require('dotenv-flow').config({ silent: true });

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

describe('GET /admin/topics/:id', () => {
  let admin, adminToken;

  beforeEach(async () => {
    admin = await Helpers.createAdmin();
    adminToken = await Helpers.createAdminToken(admin);
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongAdminToken = 'wrong_token';
    const response = await agent.get('/admin/topics/0').set('Cookie', `adminToken=${wrongAdminToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.get('/admin/topics/0');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 404 when topic id is not found', async () => {
    const response = await agent.get('/admin/topics/0').set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Tópico não encontrado');
  });

  it('should return one topic with the especific id and valid cookie', async () =>{
    const course = await Helpers.createCourse();
    const chapter = await Helpers.createChapter(course.id);
    const topic = await Helpers.createTopic(chapter.id);

    const response = await agent.get(`/admin/topics/${topic.id}`).set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(topic);
  });
});

describe('POST /admin/topics', () => {
  let admin, adminToken, chapter;

  beforeEach(async () => {
    admin = await Helpers.createAdmin();
    adminToken = await Helpers.createAdminToken(admin);
    const course = await Helpers.createCourse();
    chapter = await Helpers.createChapter(course.id);
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongAdminToken = 'wrong_token';
    const response = await agent.post('/admin/topics').set('Cookie', `adminToken=${wrongAdminToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.post('/admin/topics');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 422 when called with invalid topic data', async () => {
    const body = { title: 'title topic' };
    const response = await agent.post('/admin/topics').send(body).set('Cookie', `adminToken=${adminToken}`);
  
    expect(response.status).toBe(422);
    expect(response.body.message).toEqual('Não foi possível processar o formato dos dados');
  });

  it('should return 404 when chapterId is not associated to any chapter in DB', async () => {
    const body = { title: 'title topic', chapterId: 0 };
    const response = await agent.post('/admin/topics').send(body).set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Capítulo não encontrado');
  });

  it('should return the chapter created with valid cookie', async () =>{
    const body = { title: 'title topic', chapterId: chapter.id };

    const response = await agent.post('/admin/topics').send(body).set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: body.title,
      chapterId: body.chapterId,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    }));
  });
});

describe('PUT /admin/topics/:id', () => {
  let admin, adminToken, chapter;

  beforeEach(async () => {
    admin = await Helpers.createAdmin();
    adminToken = await Helpers.createAdminToken(admin);
    const course = await Helpers.createCourse();
    chapter = await Helpers.createChapter(course.id);
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongAdminToken = 'wrong_token';
    const response = await agent.put('/admin/topics/0').set('Cookie', `adminToken=${wrongAdminToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.put('/admin/topics/0');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return 422 when called with invalid topic data', async () => {
    const body = { data: 'invalid' };
    const response = await agent.put('/admin/topics/0').send(body).set('Cookie', `adminToken=${adminToken}`);
  
    expect(response.status).toBe(422);
    expect(response.body.message).toEqual('Não foi possível processar o formato dos dados');
  });

  it('should return 404 when chapterId is not associated to any chapter in DB', async () => {
    const body = { title: 'title updated topic', chapterId: 0 };
    const response = await agent.put('/admin/topics/0').send(body).set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Capítulo não encontrado');
  });

  it('should return 404 when topic id is not found', async () => {
    const body = { title: 'title updated topic', chapterId: chapter.id };
    const response = await agent.put('/admin/topics/0').send(body).set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Tópico não encontrado');
  });

  it('should return the chapter updated with valid cookie', async () =>{
    const topic = await Helpers.createTopic(chapter.id);
    const body = { title: 'title updated topic', chapterId: chapter.id };

    const response = await agent.put(`/admin/topics/${topic.id}`).send(body).set('Cookie', `adminToken=${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      id: topic.id,
      title: body.title,
      chapterId: body.chapterId,
      createdAt: topic.createdAt,
      updatedAt: expect.any(String),
    }));
  });
});

describe('GET /admin/topics', () => {
  let admin, adminToken;

  beforeEach(async () => {
    admin = await Helpers.createAdmin();
    adminToken = await Helpers.createAdminToken(admin);
  });

  it('should return 401 when cookie is invalid', async () => {
    const wrongAdminToken = 'wrong_token';
    const response = await agent.get('/admin/topics').set('Cookie', `adminToken=${wrongAdminToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token inválido');
  });

  it('should return 401 when no cookie is sent', async () => {
    const response = await agent.get('/admin/topics');

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token não encontrado');
  });

  it('should return the array and the headers expected with valid cookie', async () => {
    const course = await Helpers.createCourse();
    const chapter = await Helpers.createChapter(course.id);
    const topic = await Helpers.createTopic(chapter.id);

    const response = await agent.get('/admin/topics').set('Cookie', `adminToken=${adminToken}`);

    expect(response.headers).toHaveProperty('access-control-expose-headers');
    expect(response.headers['content-range']).toEqual('0-1/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(topic),
      ]),
    );
  });
});

