const express = require('express');
const jwt = require('jsonwebtoken');
const { adminLogin } = require('../middlewares'); 

const router = express.Router();

router.post('/login', adminLogin, (req, res) => {
    const token = jwt.sign(req.admin, process.env.ADMIN_SECRET);

    res.cookie('token', token);
    res.status(200).send(req.admin);
});

router.post('/logout', /* Middleware de Autentificação */ (req, res) => {
    res.clearCookie('token');
    res.status(200).send('Logout efetuado com sucesso');
});

module.exports = router;
