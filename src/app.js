require('dotenv').config();
require('express-async-errors');

const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

const usersRouter = require('./routers/usersRouter');

app.use('/users', usersRouter);
app.use((error, res, req, next) => {
  console.error(error);
  res.status(500).send({ message: 'Erro interno do servidor' });
});

module.exports = app;
