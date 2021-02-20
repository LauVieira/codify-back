const Err = require('../errors');
const { sanitiseObj } = require('../utils/generalFunctions');

function schemaMiddleware (schema) {
  return function (req, res, next) {
    const sanitized = sanitiseObj(req.body);
    const validation = schema.validate(sanitized);

    if (validation.error) {
      throw new Err.InvalidDataError();
    }

    next();
  };
}

module.exports = schemaMiddleware;
