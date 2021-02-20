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
