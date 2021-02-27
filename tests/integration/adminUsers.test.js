/* global afterAll, jest, describe, it, expect  */
require('dotenv-flow').config({ silent: true });

const app = require('../../src/app');
const supertest = require('supertest');
const agent = supertest(app);

const sequelize = require('../../src/utils/database');

const Helpers = require('../Helpers');

const redis = require('../../src/utils/redis');

beforeEach(async () => {
  await Helpers.eraseDatabase();
});

afterAll(async () => {
  await Helpers.eraseDatabase();
  await sequelize.close();
  await redis.endConnection();
});

describe('POST /admin/users/login', () => {
  it('should return 200 when passed valid parameters', async () => {
    const body = { 
      username: 'admin',
      password: '123456' 
    };
    
    const admin = await Helpers.createAdmin();
    delete admin.password;
    
    const response = await agent.post('/admin/users/login').send(body);

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie'][0]).toContain('adminToken');
    expect(response.body).toMatchObject(admin);
  });

  it('should return 422 when passed missing parameters', async () => {
    const body = { username: 'teste' };
    const response = await agent.post('/admin/users/login').send(body);

    expect(response.status).toBe(422);
    expect(response.body.message).toEqual('Não foi possível processar o formato dos dados');
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
      username: 'admin',
      password: '1234567890',
    };

    await Helpers.createAdmin();

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
    const admin = await Helpers.createAdmin();
    const adminToken = await Helpers.createAdminToken(admin);

    const sessionBefore = await redis.getSession(adminToken);
    const response = await agent.post('/admin/users/logout').set('Cookie', `adminToken=${adminToken}`);

    const session = await redis.getSession(adminToken);

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie'][0]).toContain('Expires');
    expect(session).toBeFalsy();
  });
});
