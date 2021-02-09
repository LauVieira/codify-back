require('express-async-errors');
require('dotenv').config();
require('./utils/loadRelationships');

const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');

const { userAuthentication } = require('./middlewares');
const usersRouter = require('./routers/usersRouter');
const coursesRouter = require('./routers/coursesRouter');
const Routers = require('./routers');
const Err = require('./errors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/courses', userAuthentication, coursesRouter);
app.use('/admin', Routers.admin);

app.use((error, req, res, next) => {
  const { message } = error;
  console.error(error);

  if (error instanceof Err.NotFoundError) return res.status(404).send(message);
  if (error instanceof Err.InvalidDataError) return res.status(422).send(message);
  if (error instanceof Err.ConflictError) return res.status(409).send(message);
  if (error instanceof Err.UnauthorizedError) return res.status(401).send(message);
  if (error instanceof Err.ForbiddenError) return res.status(403).send(message);
  
  return res.status(500).send('Erro interno no servidor');
});

module.exports = app;
