const express = require('express');
const jwt = require('jsonwebtoken');
const { adminLogin, adminAuthentication } = require('../../middlewares');

const router = express.Router();

router.post('/login', adminLogin, (req, res) => {
    delete req.admin.password;
    const adminToken = jwt.sign(req.admin, process.env.ADMIN_SECRET);

    const cookieOptions = {};

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
        cookieOptions.sameSite = 'none';
    }

    res.cookie('adminToken', adminToken, cookieOptions);
    res.status(200).send(req.admin);
});

router.post('/logout', adminAuthentication, (req, res) => {
    res.clearCookie('adminToken');

    res.status(200).send({ message: 'Logout efetuado com sucesso' });
});

module.exports = router;
