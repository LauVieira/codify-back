/* global jest, describe, it, expect  */
require('dotenv').config();
const Err = require('../../src/errors');
const CoursesController = require('../../src/controllers/CoursesController');
const Course = require('../../src/models/Course');

jest.mock('sequelize');
jest.mock('../../src/models/Course');

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

describe('getCourse', () => {
  it('should return a course', async () => {
    const id = 1;
    const spy = jest.spyOn(Course, 'findByPk');
    CoursesController.getCourse(id);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id);
  });
});

describe('getAll', () => {
  it('should return an array', async () => {
    const spy = jest.spyOn(Course, 'findAll');
    CoursesController.getAll(10, 5);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 10, offset: 5 }),
    );
  });
});

describe('createCourse', () => {
  it('should throw error when trying to create existing Course', async () => {
    const newObject = { name: 'mockedObj' };
    const expectedObject = { name: 'mockedObj', id: 1 };

    const spy = jest.spyOn(Course, 'findOne');
    spy.mockResolvedValueOnce(newObject);

    const error = () => CoursesController.createCourse(expectedObject);
    
    expect(error).rejects.toThrow(Err.ConflictError);
    expect(spy).toHaveBeenCalled();
  });

  it('should create course if it does not exist yet', async () => {
    const newObject = { name: 'mockedObj' };
    const expectedObject = { name: 'mockedObj', id: 1 };
    Course.findOne.mockResolvedValueOnce(null);
    Course.create.mockResolvedValueOnce(expectedObject);

    const spy = jest.spyOn(Course, 'create');

    const request = await CoursesController.createCourse(newObject);
    
    expect(spy).toHaveBeenCalledWith(newObject);
    expect(request).toEqual(expectedObject);
  });
});

describe('editCourse', () => {
  it('should throw error when trying to create existing Course', async () => {
    const courseData = { name: 'mockedObj', id: 1 };
    Course.findByPk.mockResolvedValueOnce(null);

    const spy = jest.spyOn(Course, 'findByPk');

    const error = () => CoursesController.editCourse(courseData.id, courseData);
    
    expect(error).rejects.toThrow(Err.NotFoundError);
    expect(spy).toHaveBeenCalled();
  });

  it('should return the object updated', async () => {
    const save = jest.fn();
    const oldObject = { name: 'mockedObj Old', save };
    const expectedObject = { name: 'mockedObj New' };
    Course.findByPk.mockResolvedValueOnce(oldObject);

    const spy = jest.spyOn(Course, 'findByPk');

    const request = await CoursesController.editCourse(2, expectedObject);
    
    expect(spy).toHaveBeenCalled();
    expect(save).toHaveBeenCalled();
    expect(request).toEqual(
      expect.objectContaining(expectedObject)
    );
  });
});
