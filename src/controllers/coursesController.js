const Course = require('../models/Course');

class CoursesController {
  getSuggestions (limit = null) {
    return Course.findAll({ limit });
  }

  getAll (limit = null, offset = null) {
    return Course.findAll({ limit, offset });
  }
}

module.exports = new CoursesController();
