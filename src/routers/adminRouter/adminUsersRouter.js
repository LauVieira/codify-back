const express = require('express');
const jwt = require('jsonwebtoken');
const { adminLogin, adminAuthentication } = require('../../middlewares');

const router = express.Router();

router.post('/login', adminLogin, (req, res) => {
    delete req.admin.password;
    const adminToken = jwt.sign(req.admin, process.env.ADMIN_SECRET);

    res.cookie('adminToken', adminToken, { secure: true, sameSite: 'none' });
    res.status(200).send(req.admin);
});

router.post('/logout', adminAuthentication, (req, res) => {
    res.clearCookie('adminToken', { secure: true, sameSite: 'none' });

    res.status(200).send({ message: 'Logout efetuado com sucesso' });
});

module.exports = router;
