/* global jest, describe, it, expect  */
require('dotenv').config();
const CoursesController = require('../../src/controllers/CoursesController');
const Course = require('../../src/models/Course');

jest.mock('sequelize');

describe('getSuggestions', () => {
  it('should return an array', async () => {
    const spy = jest.spyOn(Course, 'findAll');
    CoursesController.getSuggestions(10);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 10 }),
    );
  });
});

// describe('getCourse', () => {
//   it('should return a course', async () => {
//     const id = 1;
//     const spy = jest.spyOn(Course, 'findByPk');
//     CoursesController.getCourse(id);

//     expect(spy).toHaveBeenCalled();
//     expect(spy).toHaveBeenCalledWith(id),
//     );
//   });
// });
