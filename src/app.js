require('express-async-errors');
require('dotenv').config();
require('./utils/loadRelationships');
const express = require('express');
const cors = require('cors');

const usersRouter = require("./routers/usersRouter");

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', usersRouter);

app.use((error, req, res, next)=>{
    //if (error instanceof Xxxxxxxxx) return res.sendStatus(xxx);
    console.log(error);
    return res.sendStatus(500);
})

module.exports = app;
