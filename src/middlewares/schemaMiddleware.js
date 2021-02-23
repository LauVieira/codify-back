const Err = require('../errors');

function schemaMiddleware (schema) {
  return function (req, res, next) {
    const validation = schema.validate(req.body);

    if (validation.error) {
      throw new Err.InvalidDataError();
    }

    next();
  };
}

module.exports = schemaMiddleware;
