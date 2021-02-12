const { NotFoundError } = require('../errors');

const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');
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

  async getTopic (id) {
    const topic = await Topic.findByPk(id, { 
      include: { 
        model: Activity,
        include: [{
          model: Theory
        }, {
          model: Exercise
        }]
      } 
    });

    if (!topic) throw new NotFoundError('Tópico não encontrado');
    return topic;
  }

  async getChapter (id) {
    const chapter = await Chapter.findByPk(id);
    if (!chapter) throw new NotFoundError('Capitulo não encontrado');
    return chapter;
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
