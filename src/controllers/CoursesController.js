const { NotFoundError } = require('../errors');
const Err = require('../errors');

const Course = require('../models/Course');
const CourseUser = require('../models/CourseUser');
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

  async deleteCourse (id) {
    const course = await Course.findByPk(id);
    if (course === null) throw new Err.NotFoundError('Curso não encontrado');
    
    CourseUser.destroy({ where: { courseId: id } });

    await course.destroy();
  }
}

module.exports = new CoursesController();
