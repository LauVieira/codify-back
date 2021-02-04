require('express-async-errors');
require('dotenv').config();
require('express-async-errors');

const cookieParser = require('cookie-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const usersRouter = require('./routers/usersRouter');
const { NotFoundError, InvalidDataError, ConflictError, UnauthorizedError, ForbiddenError } = require('./errors');

const app = express();

app.use(cookieParser());
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
  if (error instanceof ForbiddenError) return res.status(403).send(error.message);
  return res.sendStatus(500);
});

module.exports = app;
