require('express-async-errors');
require('dotenv').config();
require('express-async-errors');
require('./utils/loadRelationships');

const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');

const usersRouter = require('./routers/usersRouter');
const coursesRouter = require('./routers/coursesRouter');
const NotFoundError = require('./errors/NotFoundError');
const InvalidDataError = require('./errors/InvalidDataError');
const ConflictError = require('./errors/ConflictError');

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/courses', coursesRouter);

app.use((error, req, res, next) => {
  if (error instanceof NotFoundError) return res.sendStatus(404).send(error.message);
  if (error instanceof InvalidDataError) return res.sendStatus(422).send(error.message);
  if (error instanceof ConflictError) return res.sendStatus(409).send(error.message);
  return res.sendStatus(500);
});

module.exports = app;
