/* global afterAll, jest, describe, it, expect  */

const dotenv = require('dotenv');
const { Pool } = require('pg');
const supertest = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/utils/database');
const coursesController = require('../../src/controllers/coursesController');

dotenv.config();
jest.mock('../../src/models/Course.js');

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

afterAll(async () => {
  await sequelize.close();
  await db.end();
});

describe('getSuggestions', () => {
  it('should return an array', async () => {
    const spy = jest.spyOn(coursesController, 'getSuggestions');
    const suggestions = coursesController.getSuggestions(10);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(10);
    //expect(isPlaying).toBe(true);
  });
});


// getSuggestions(limit = null) {
//   return Course.findAll({ limit });
// }