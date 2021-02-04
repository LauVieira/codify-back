require('express-async-errors');
require('dotenv').config();
require('./utils/loadRelationships');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const usersRouter = require('./routers/usersRouter');
const NotFoundError = require('./errors/NotFoundError');
const InvalidDataError = require('./errors/InvalidDataError');
const ConflictError = require('./errors/ConflictError');
const UnauthorizedError = require('./errors/UnauthorizedError');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/users', usersRouter);

/* eslint-disable-next-line no-unused-vars */
app.use((error, req, res, next) => {
  if (error instanceof NotFoundError) return res.status(404).send(error.message);
  if (error instanceof InvalidDataError) return res.status(422).send(error.message);
  if (error instanceof ConflictError) return res.status(409).send(error.message);
  if (error instanceof UnauthorizedError) return res.status(401).send(error.message);
  return res.sendStatus(500);
});

module.exports = app;
