const Course = require('../models/Course');

class CoursesController {
  getSuggestions (limit = null) {
    return Course.findAll({ limit });
  }
}

module.exports = new CoursesController();
