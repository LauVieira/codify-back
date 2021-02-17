const { NotFoundError } = require('../errors');
const Err = require('../errors');

const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');

class CoursesController {
  getSuggestions (limit = null) {
    return Course.findAll({ limit });
  }

  async getCourse (id) {
    const course = await Course.findByPk(id);
    if (!course) throw new NotFoundError('Curso não encontrado');
    return course;
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
    const course = await Course.findOne({ where: { id } });
    if (course === null) throw new Err.NotFoundError('Course not found');

    return course;
  }

  async createCourse (courseData) {
    const course = await Course.findOne({ where: { title: courseData.title } });
    if (course !== null) throw new Err.ConflictError('Course already exists');

    const createdCourse = await Course.create(courseData);
    
    return createdCourse;
  }
}
module.exports = new CoursesController();
