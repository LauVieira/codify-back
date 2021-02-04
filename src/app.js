require('express-async-errors');
require('dotenv').config();
require('./utils/loadRelationships');

const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');

const { userAuthentication } = require('./middlewares');
const usersRouter = require('./routers/usersRouter');
const coursesRouter = require('./routers/coursesRouter');
const {
  ConflictError,
  ForbbidenError,
  InvalidDataError,
  NotFoundError,
  UnauthorizedError,
} = require('./errors');

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/courses', userAuthentication, coursesRouter);

/* eslint-disable-next-line no-unused-vars */
app.use((error, req, res, next) => {
  if (error instanceof NotFoundError) return res.status(404).send(error.message);
  if (error instanceof InvalidDataError) return res.status(422).send(error.message);
  if (error instanceof ConflictError) return res.status(409).send(error.message);
  if (error instanceof UnauthorizedError) return res.status(401).send(error.message);
  /* eslint-disable-next-line no-console */
  console.error(error);
  return res.sendStatus(500);
});

module.exports = app;
