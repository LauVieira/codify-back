require('express-async-errors');
require('dotenv').config();
require('./utils/loadRelationships');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');

const { userAuthentication } = require('./middlewares');
const usersRouter = require('./routers/usersRouter');
const coursesRouter = require('./routers/coursesRouter');
const Routers = require('./routers');
const Err = require('./errors');

const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(express.json());
app.use(cors({ 
  origin: process.env.FRONT_URL || 'http://localhost:9000', 
  credentials: true 
}));

app.use('/users', usersRouter);
app.use('/courses', userAuthentication, coursesRouter);
app.use('/admin', Routers.adminRouter);

app.use((error, req, res, next) => {
  console.error(error);
  const { message } = error;
  if (error instanceof Err.NotFoundError) return res.status(404).send(message);
  if (error instanceof Err.InvalidDataError) return res.status(422).send(message);
  if (error instanceof Err.ConflictError) return res.status(409).send(message);
  if (error instanceof Err.UnauthorizedError) return res.status(401).send(message);
  if (error instanceof Err.ForbiddenError) return res.status(403).send(message);
  
  res.status(500).send('Erro interno no servidor');
});

module.exports = app;
