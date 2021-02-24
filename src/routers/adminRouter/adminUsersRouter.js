const express = require('express');
const jwt = require('jsonwebtoken');
const { adminLogin, adminAuthentication } = require('../../middlewares');
const sessionStore = require('../../utils/redis');

const router = express.Router();

router.post('/login', adminLogin, async (req, res) => {
    delete req.admin.password;
    const adminToken = jwt.sign(req.admin, process.env.ADMIN_SECRET);
    await sessionStore.setSession(adminToken, req.admin.username);

    const cookieOptions = {};

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
        cookieOptions.sameSite = 'none';
    }
    
    res.cookie('adminToken', adminToken, cookieOptions);
    res.status(200).send(req.admin);
});

router.post('/logout', adminAuthentication, async (req, res) => {
    await sessionStore.deleteSession(req.adminToken);
    res.clearCookie('adminToken');

    res.status(200).send({ message: 'Logout efetuado com sucesso' });
});

module.exports = router;
