/* eslint-disable class-methods-use-this */

const {
  ConflictError,
  ForbbidenError,
  InvalidDataError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');

const Course = require('../models/Course');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');

class CoursesController {
  async getCourse (id) {
    const course = await Course.findByPk(id);
    if (!course) throw new NotFoundError('Curso não encontrado');
    return course;
  }

  getProgram (courseId){
    return Topic.findAll({ where: { courseId }, 
      include: { model: Lesson, 
        include: { 
        model: Exercise
        }
      } });
  }
}

module.exports = new CoursesController();
