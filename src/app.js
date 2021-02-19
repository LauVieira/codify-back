require('express-async-errors');
require('dotenv').config();
require('./utils/loadRelationships');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');

const { userAuthentication } = require('./middlewares');
const Routers = require('./routers');
const Err = require('./errors');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ 
  origin: process.env.FRONT_URL || 'http://localhost:9000', 
  credentials: true 
}));

app.use('/users', Routers.users);
app.use('/courses', userAuthentication, Routers.courses);
app.use('/admin', Routers.admin);

app.use((error, req, res, next) => {
  const { message } = error;
  
  if (error instanceof Err.NotFoundError) return res.status(404).send({ message });
  if (error instanceof Err.InvalidDataError) return res.status(422).send({ message, details: error.details });
  if (error instanceof Err.ConflictError) return res.status(409).send({ message });
  if (error instanceof Err.UnauthorizedError) return res.status(401).send({ message });
  if (error instanceof Err.ForbiddenError) return res.status(403).send({ message });
  
  res.status(500).send('Erro interno no servidor');
  console.error(error);
});

module.exports = app;
