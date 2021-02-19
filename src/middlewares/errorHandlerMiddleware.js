const {
  NotFoundError,
  InvalidDataError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError
} = require('../errors');

/* eslint-disable-next-line no-unused-vars */
function errorHandlerMiddleware (error, req, res, next) {
  console.error(error);
  const { message } = error;
  
  if (error instanceof NotFoundError) { 
    return res.status(404).send({ message });
  }

  if (error instanceof InvalidDataError) { 
    return res.status(422).send({ message, details: error.details });
  }

  if (error instanceof ConflictError) {
    return res.status(409).send({ message });
  }

  if (error instanceof UnauthorizedError) {
    return res.status(401).send({ message });
  }

  if (error instanceof ForbiddenError) {
    return res.status(403).send({ message });
  }
  
  res.status(500).send({ message: 'Erro interno no servidor' });
}

module.exports = errorHandlerMiddleware;
