const { NotFoundError } = require('../errors');

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
}
module.exports = new CoursesController();
