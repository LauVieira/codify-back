const Err = require('../errors');
const { Op } = require('sequelize');

const Course = require('../models/Course');
const CourseUser = require('../models/CourseUser');
const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');
const ActivityUser = require('../models/ActivityUser');
const Theory = require('../models/Theory');
const Exercise = require('../models/Exercise');

class CoursesController {
  async getSuggestions (userId, limit=null) {
    let initialized = await CourseUser.findAll({ where: { userId }, required: false });
    initialized = initialized.map(item => item.courseId);

    const courses = await Course.findAll({ 
      where: { 
        id: { 
          [Op.notIn]: initialized 
        } 
      }, 
      limit 
    });

    return courses;
  }

  async getInitializedCourses (userId, limit=null) {
    let initialized = await CourseUser.findAll({ where: { userId }, required: false });
    initialized = initialized.map(item => item.courseId);

    const courses = await Course.findAll({ where: { id: initialized }, limit });
    
    return courses;
  }

  async getCourse (id) {
    const course = await Course.findByPk(id);

    if (!course) throw new NotFoundError('Curso não encontrado');
    return course;
  }

  async getTopic (id, userId) {
    const topic = await Topic.findByPk(id, { 
      include: { 
        model: Activity,
        order: ['order', 'ASC'],
        include: [{
          model: Theory
        }, {
          model: Exercise
        }, {
          model: ActivityUser,
          where: { userId },
          required: false
        }]
      },
    });

    if (!topic) throw new NotFoundError('Tópico não encontrado');
    return topic;
  }

  async isTopicDone (topicId, userId) {
    const { count: totalActivities, rows: activities } = await Activity.findAndCountAll({ where: { topicId } });
    const activitiesId = activities.map(activity => activity.id);
    const { count: doneActivities } = await ActivityUser.findAndCountAll({ where: { userId, activityId: activitiesId } });
    return (doneActivities / totalActivities) === 1 ? true: false;
  }

  async getProgram (userId, courseId){
    const program = await Chapter.findAll({ where: { courseId }, 
      include: { model: Topic, 
        include: { 
          model: Activity
        }
      } 
    });



    await Promise.all(program.map(chapter => {
      return Promise.all(chapter.topics.map(async topic => {
        const done = await this.isTopicDone(topic.id, userId);
        topic.dataValues.done = done; 
      }));
    }));

    return program;
  }

  async getProgress (userId, courseId) {
    const { count: totalActivities } = await Activity.findAndCountAll({ where: { courseId } });
    const { count: doneActivities } = await ActivityUser.findAndCountAll({ where: { userId, courseId } });

    return Math.floor(100 * doneActivities / totalActivities);
  }

  getAll (limit = null, offset = null) {
    return Course.findAll({ limit, offset });
  }

  async isInitialized (courseId, userId) {
    await this.getCourse(courseId);
    
    const courseUser = await CourseUser.findOne({ where: { courseId, userId } });
    
    return courseUser ? true : false;
  }

  async initializeCourse (courseId, userId) {
    await this.getCourse(courseId);

    const alreadyInitialized = await this.isInitialized(courseId, userId);

    if (alreadyInitialized) return;

    const courseUser = await CourseUser.create({ courseId, userId });
    return courseUser;
  }

  async createCourse (courseData) {
    const course = await Course.findOne({ where: { title: courseData.title } });
    if (course !== null) throw new Err.ConflictError('Curso já existe');

    const createdCourse = await Course.create(courseData);
    
    return createdCourse;
  }

  async editCourse (id, courseData) {
    const course = await Course.findByPk(id);
    if (course === null) throw new Err.NotFoundError('Curso não encontrado');

    Object.assign(course, courseData);
    await course.save();
    return course;
  }

  getAllTopics (limit = null, offset = null, filter = {}) {
    return Topic.findAndCountAll({ 
      where: filter, 
      limit, 
      offset,
      include: {
        model: Chapter,
      },
      attributes: ['id', 'title', 'chapterId', [sequelize.col('chapter."courseId"'), 'courseId']],
    });
  }

  async getTopicById (id) {
    const topic = await Topic.findByPk(id);

    if (!topic) {
      throw new Err.NotFoundError('Tópico não encontrado');
    }

    return topic;
  }

  async createTopic (topicData) {
    await this.getChapter(topicData.chapterId);

    const createdTopic = await Topic.create(topicData);
    
    return createdTopic;
  }

  async editTopic (id, topicData) {
    await this.getChapter(topicData.chapterId);

    const topic = await this.getTopicById(id);
    Object.assign(topic, topicData);

    await topic.save();
    return topic;
  }

  async getChapter (id) {
    const chapter = await Chapter.findByPk(id);

    if (!chapter) { 
      throw new NotFoundError('Capítulo não encontrado');
    }

    return chapter;
  }

  getAllChapters (limit = null, offset = null, filter = {}) {
    return Chapter.findAndCountAll({ where: filter, limit, offset });
  }

  async createChapter (chapterData) {
    await this.getCourse(chapterData.courseId);

    const createdChapter = await Chapter.create(chapterData);
    
    return createdChapter;
  }

  async editChapter (id, chapterData) {
    await this.getCourse(chapterData.courseId);

    const chapter = await this.getChapter(id);

    Object.assign(chapter, chapterData);
    await chapter.save();
    return chapter;
  }

  async getActivity (id) {
    const activity = await Activity.findByPk(id);

    if (!activity) {
      throw new NotFoundError('Atividade não encontrada');
    }
    
    return activity;
  }

  async activityDone (activityId, userId, courseId) {
    let activityUser = await ActivityUser.findOne({ where: { activityId, userId } });

    if (!activityUser) {
      activityUser = await ActivityUser.create({ activityId, userId, courseId });
      return { done: true };
    }

    await activityUser.destroy();

    return { done: false };
  }

  async getLastActivity (userId, courseId) {
    await this.getCourse(courseId);

    const activityUser = await ActivityUser.findAll({ 
      where: { userId, courseId }, 
      order: [['createdAt', 'DESC']],
      required: true
    });

    if (activityUser.length === 0) {
      return { firstActivity: true };
    }

    const activity = await this.getActivity(activityUser[0].activityId);

    const topic = await this.getTopicById(activity.topicId);

    const chapter = await this.getChapter(topic.chapterId);

    return { 
      activityId: activity.id, 
      topicId: topic.id, 
      chapterId: chapter.id,
    };
  }

  getAllTheories (limit = null, offset = null, filter = {}) {
    return Theory.findAndCountAll({ 
      where: filter, 
      limit, 
      offset,
      include: {
        model: Activity,
        include: {
          model: Topic,
          include: {
            model: Chapter
          }
        }
      },
      attributes: ['id', 'title', 'chapterId', [sequelize.col('chapter."courseId"'), 'courseId']],
    });
  }
}

module.exports = new CoursesController();
