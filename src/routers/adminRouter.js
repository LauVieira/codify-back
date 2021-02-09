const express = require('express');
const jwt = require('jsonwebtoken');
const { adminLogin } = require('../middlewares'); 

const router = express.Router();

router.post('/login', adminLogin, async (req, res) => {
    const token = jwt.sign(req.admin, process.env.SECRET);

    res.cookie('token', token);
    res.status(200).send(req.admin);
});

module.exports = router;
