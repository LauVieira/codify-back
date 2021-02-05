/* global jest, describe, it, expect  */

const dotenv = require('dotenv');
const coursesController = require('../../src/controllers/coursesController');
const Course = require('../../src/models/Course');

jest.mock('sequelize');

dotenv.config();

describe('getSuggestions', () => {
  it('should return an array', async () => {
    const spy = jest.spyOn(Course, 'findAll');
    coursesController.getSuggestions(10);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 10 }),
    );
  });
});

// describe('getCourse', () => {
//   it('should return a course', async () => {
//     const id = 31;
//     const spy = jest.spyOn(Course, 'findByPk');
//     coursesController.getCourse(id);

//     expect(spy).toHaveBeenCalled();
//     expect(spy).toHaveBeenCalledWith(id),
//     );
//   });
// });
