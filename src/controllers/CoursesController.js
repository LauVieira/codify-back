const { NotFoundError } = require('../errors');
const Err = require('../errors');

const Course = require('../models/Course');
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

  async getTopic (id, userId = 150) {
    const topic = await Topic.findByPk(id, { 
      include: { 
        model: Activity,
        order: ['order', 'ASC'],
        include: [{
          model: Theory
        }, {
          model: Exercise
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

  activityDone (activityId, userId) {
    return ActivityUser.create({ activityId, userId, done: true });
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

  async getById (id) {
    const course = await Course.findByPk(id);
    if (course === null) throw new Err.NotFoundError('Curso não encontrado');

    return course;
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
}
module.exports = new CoursesController();
