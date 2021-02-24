const jwt = require('jsonwebtoken');
const Err = require('../errors');
const sessionStore = require('../utils/redis');

async function adminAuthentication (req, res, next) {
  const { adminToken } = req.cookies;
  if (!adminToken) {
    throw new Err.UnauthorizedError('Token não encontrado');
  }

  const isValid = await sessionStore.getSession(adminToken);
  if (!isValid) {
    throw new UnauthorizedError('Token expirado');
  }

  jwt.verify(adminToken, process.env.ADMIN_SECRET, (err, decoded) => {
    if (err) {
      throw new Err.UnauthorizedError('Token inválido');
    }

    req.admin = decoded;
    req.adminToken = adminToken;
    next();
  });
}

module.exports = adminAuthentication;
