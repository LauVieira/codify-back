/* global jest, describe, it, expect  */
require('dotenv-flow').config({ silent: true });

const CoursesController = require('../../src/controllers/CoursesController');
const Course = require('../../src/models/Course');
const Topic = require('../../src/models/Topic');
const Chapter = require('../../src/models/Chapter');
const Activity = require('../../src/models/Activity');
const ActivityUser = require('../../src/models/ActivityUser');
const Err = require('../../src/errors');

jest.mock('../../src/models/ActivityUser');
jest.mock('sequelize');
jest.mock('../../src/models/Course');

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

  it('should throw an NotFoundError in topic', async () => {
    const id = 3;

    Topic.findByPk.mockImplementationOnce(() => null);

    const error = () => CoursesController.getTopic(id);

    expect(error).rejects.toThrow(Err.NotFoundError);
  });
});

describe('getChapter', () => {
  it('should return a chapter', () => {
    const id = 1;
    const spy = jest.spyOn(Chapter, 'findByPk');
    CoursesController.getChapter(id);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should throw an NotFoundError in chapter', async () => {
    const id = 3;

    Chapter.findByPk.mockImplementationOnce(() => null);

    const error = () => CoursesController.getChapter(id);

    expect(error).rejects.toThrow(Err.NotFoundError);
  });
});

describe('getTopicById', () => {
  it('should return a topic', () => {
    const id = 1;
    const spy = jest.spyOn(Topic, 'findByPk');
    CoursesController.getTopicById(id);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should throw an NotFoundError in topic', async () => {
    const id = 3;

    Topic.findByPk.mockImplementationOnce(() => null);

    const error = () => CoursesController.getTopicById(id);

    expect(error).rejects.toThrow(Err.NotFoundError);
  });
});

describe('getActivity', () => {
  it('should return a activity', () => {
    const id = 1;
    const spy = jest.spyOn(Activity, 'findByPk');
    CoursesController.getActivity(id);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should throw an NotFoundError in activity', async () => {
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

describe('getAllChapters', () => {
  it('should return an array with chapters', async () => {
    const spy = jest.spyOn(Chapter, 'findAndCountAll');
    CoursesController.getAllChapters(10, 5);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 10, offset: 5 }),
    );
  });
});

describe('getAllTopics', () => {
  it('should return an array with topics', async () => {
    const spy = jest.spyOn(Topic, 'findAndCountAll');
    CoursesController.getAllTopics(10, 5);

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

describe('editChapter', () => {
  it('should return the object updated to chapter', async () => {
    const save = jest.fn();
    const oldObject = { title: 'mockedTitle Old', save };
    const expectedObject = { title: 'mockedTitle New' };

    jest.spyOn(CoursesController, 'getCourse').mockResolvedValueOnce({});
    jest.spyOn(CoursesController, 'getChapter').mockResolvedValueOnce(oldObject);

    const request = await CoursesController.editChapter(2, expectedObject);
    
    expect(save).toHaveBeenCalled();
    expect(request).toEqual(
      expect.objectContaining(expectedObject)
    );
  });
});

describe('editTopic', () => {
  it('should return the object updated to topic', async () => {
    const save = jest.fn();
    const oldObject = { title: 'mockedTitle Old', save };
    const expectedObject = { title: 'mockedTitle New' };

    jest.spyOn(CoursesController, 'getChapter').mockResolvedValueOnce({});
    jest.spyOn(CoursesController, 'getTopicById').mockResolvedValueOnce(oldObject);

    const request = await CoursesController.editTopic(2, expectedObject);
    
    expect(save).toHaveBeenCalled();
    expect(request).toEqual(
      expect.objectContaining(expectedObject)
    );
  });
});

describe('createChapter', () => {
  it('should create a chapter', async () => {
    const newObject = { name: 'mockedObj' };
    const expectedObject = { name: 'mockedObj', id: 1 };

    jest.spyOn(CoursesController, 'getCourse').mockResolvedValueOnce({});
    Chapter.create.mockResolvedValueOnce(expectedObject);
  
    const spy = jest.spyOn(Chapter, 'create');
  
    const request = await CoursesController.createChapter(newObject);
    
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(newObject);
    expect(request).toEqual(expectedObject);
  });
});

describe('createTopic', () => {
  it('should create a topic', async () => {
    const newObject = { name: 'mockedObj' };
    const expectedObject = { name: 'mockedObj', id: 1 };

    jest.spyOn(CoursesController, 'getChapter').mockResolvedValueOnce({});
    Topic.create.mockResolvedValueOnce(expectedObject);
  
    const spy = jest.spyOn(Chapter, 'create');
  
    const request = await CoursesController.createTopic(newObject);
    
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(newObject);
    expect(request).toEqual(expectedObject);
  });
});
