require('dotenv').config();
require('express-async-errors');
require('./utils/loadRelationships');

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
    res.status(500).send({message: 'Internet server error'});
});

module.exports = app;
