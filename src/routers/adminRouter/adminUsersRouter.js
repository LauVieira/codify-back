const express = require('express');
const jwt = require('jsonwebtoken');
const { adminLogin, adminAuthentication } = require('../../middlewares');

const router = express.Router();

router.post('/login', adminLogin, (req, res) => {
    const adminToken = jwt.sign(req.admin, process.env.ADMIN_SECRET);

    res.cookie('adminToken', adminToken);
    res.status(200).send(req.admin);
});

router.post('/logout', adminAuthentication, (req, res) => {
    res.clearCookie('adminToken');

    res.status(200).send({ message: 'Logout efetuado com sucesso' });
});

module.exports = router;
