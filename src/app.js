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

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/users', usersRouter);

app.use((error, req, res, next) => {
  if (error instanceof NotFoundError) return res.sendStatus(404);
  if (error instanceof InvalidDataError) return res.sendStatus(422);
  if (error instanceof ConflictError) return res.sendStatus(409);
  return res.sendStatus(500);
});

module.exports = app;
