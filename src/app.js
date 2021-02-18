require('express-async-errors');
require('dotenv-flow').config();
require('./utils/loadRelationships');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');

const { errorHandlerMiddleware } = require('./middlewares');
const router = require('./routers');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ 
  origin: process.env.FRONT_URL || 'http://localhost:9000', 
  credentials: true 
}));

app.use(router);
app.use(errorHandlerMiddleware);

module.exports = app;
