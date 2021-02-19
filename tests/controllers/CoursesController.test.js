/* global jest, describe, it, expect  */
const CoursesController = require('../../src/controllers/CoursesController');
const Course = require('../../src/models/Course');
const Topic = require('../../src/models/Topic');
const Chapter = require('../../src/models/Chapter');
const Activity = require('../../src/models/Activity');
const ActivityUser = require('../../src/models/ActivityUser');
const Err = require('../../src/errors');

jest.mock('../../src/models/ActivityUser');
jest.mock('sequelize');

describe('getSuggestions', () => {
  it('should return an array', () => {
    const spy = jest.spyOn(Course, 'findAll');
    CoursesController.getSuggestions(10);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 10 }),
    );
  });
});

describe('getCourse', () => {
  it('should return a course', () => {
    const id = 1;
    const spy = jest.spyOn(Course, 'findByPk');
    CoursesController.getCourse(id);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id);
  });
});

describe('getTopic', () => {
  it('should return a topic', () => {
    const id = 1;
    const spy = jest.spyOn(Topic, 'findByPk');
    CoursesController.getTopic(id);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id, expect.any(Object));
  });

  it('should throw an NotFoundError', async () => {
    const id = 3;

    Topic.findByPk.mockImplementationOnce(() => null);

    const error = () => CoursesController.getTopic(id);

    expect(error).rejects.toThrow(Err.NotFoundError);
  });
});

describe('getChapter', () => {
  it('should return a topic', () => {
    const id = 1;
    const spy = jest.spyOn(Chapter, 'findByPk');
    CoursesController.getChapter(id);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should throw an NotFoundError', async () => {
    const id = 3;

    Chapter.findByPk.mockImplementationOnce(() => null);

    const error = () => CoursesController.getChapter(id);

    expect(error).rejects.toThrow(Err.NotFoundError);
  });
});

describe('getActivity', () => {
  it('should return a topic', () => {
    const id = 1;
    const spy = jest.spyOn(Activity, 'findByPk');
    CoursesController.getActivity(id);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should throw an NotFoundError', async () => {
    const id = 3;

    Activity.findByPk.mockImplementationOnce(() => null);

    const error = () => CoursesController.getActivity(id);

    expect(error).rejects.toThrow(Err.NotFoundError);
  });
});

describe('activityDone', () => {
  it('should create one activityDone data when dont exist in DB', async () => {
    const activityId = 1;
    const userId = 1;
    const done = true;

    ActivityUser.findOne.mockImplementationOnce(() => null);
    const spy = jest.spyOn(ActivityUser, 'create');
    await CoursesController.activityDone(activityId, userId);
    
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({ activityId, userId, done });
  });

  it('should toggle activityDone data when exist in DB', async () => {
    const activityId = 1;
    const userId = 1;

    ActivityUser.findOne.mockResolvedValueOnce({ done: true, save: async function () {} });
    const response = await CoursesController.activityDone(activityId, userId);
    
    expect(response).toMatchObject({ done: false });
  });
});

describe('getProgram', () => {
  it('should return the program of the course', () => {
    const courseId = 2;
    const spy = jest.spyOn(Chapter, 'findAll');
    CoursesController.getProgram(courseId);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ where: { courseId } }));
  });
});
