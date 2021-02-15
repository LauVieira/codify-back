/* eslint-disable class-methods-use-this */

const {
  ConflictError,
  ForbbidenError,
  InvalidDataError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');
const Course = require('../models/Course');

class CoursesController {
  getSuggestions (limit = null) {
    return Course.findAll({ limit });
  }
}

module.exports = new CoursesController();
