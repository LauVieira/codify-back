const { NotFoundError } = require('../errors');
const Err = require('../errors');

const Course = require('../models/Course');
const CourseUser = require('../models/CourseUser');
const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');
const ActivityUser = require('../models/ActivityUser');
const User = require('../models/User');
const Theory = require('../models/Theory');
const Exercise = require('../models/Exercise');

class CoursesController {
  getSuggestions (limit = null) {
    return Course.findAll({ limit });
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

  async getActivity (id) {
    const activity = await Activity.findByPk(id);
    if (!activity) throw new NotFoundError('Atividade não encontrada');
    return activity;
  }

  async getChapter (id) {
    const chapter = await Chapter.findByPk(id);
    if (!chapter) throw new NotFoundError('Capítulo não encontrado');
    return chapter;
  }

  async activityDone (activityId, userId) {
    let activityUser = await ActivityUser.findOne({ where: { activityId, userId } });

    if (!activityUser) {
      activityUser = await ActivityUser.create({ activityId, userId, done: true });
      return activityUser;
    }

    activityUser.done = !activityUser.done;
    await activityUser.save();

    return activityUser;
  }

  getProgram (courseId){
    return Chapter.findAll({ where: { courseId }, 
      include: { model: Topic, 
        include: { 
          model: Activity
        }
      } 
    });
  }

  getAll (limit = null, offset = null) {
    return Course.findAll({ limit, offset });
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

  async deleteCourse (id) {
    const course = await Course.findByPk(id);
    if (course === null) throw new Err.NotFoundError('Curso não encontrado');
    
    CourseUser.destroy({ where: { courseId: id } });

    await course.destroy();
  }

  getAllTopics (limit = null, offset = null) {
    return Topic.findAll({ limit, offset });
  }

  async getTopicById (id) {
    const topic = await Topic.findByPk(id);
    if (topic === null) throw new Err.NotFoundError('Topic não encontrado');

    return topic;
  }

  async createTopic (topicData) {
    const topic = await Topic.findOne({ where: { title: topicData.title } });
    if (topic !== null) throw new Err.ConflictError('Topico já existe');

    const createdTopic = await Topic.create(topicData);
    
    return createdTopic;
  }

  async editTopic (id, topicData) {
    const topic = await Topic.findByPk(id);
    if (topic === null) throw new Err.NotFoundError('Topico não encontrado');

    Object.assign(topic, topicData);
    await topic.save();
    return topic;
  }

  getAllChapters (limit = null, offset = null) {
    return Chapter.findAll({ limit, offset });
  }

  async getChapterById (id) {
    const chapter = await Chapter.findByPk(id);
    if (chapter === null) throw new Err.NotFoundError('Capitulo não encontrado');

    return chapter;
  }

  async createChapter (chapterData) {
    const chapter = await Chapter.findOne({ where: { title: chapterData.title } });
    if (chapter !== null) throw new Err.ConflictError('Capitulo já existe');

    const createdChapter = await Chapter.create(chapterData);
    
    return createdChapter;
  }

  async editChapter (id, chapterData) {
    const chapter = await Chapter.findByPk(id);
    if (chapter === null) throw new Err.NotFoundError('Capitulo não encontrado');

    Object.assign(chapter, chapterData);
    await chapter.save();
    return chapter;
  }
}

module.exports = new CoursesController();
