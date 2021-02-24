const jwt = require('jsonwebtoken');
const { UnauthorizedError }= require('../errors');
const sessionStore = require('../utils/redis');

async function adminAuthentication (req, res, next) {
  const { adminToken } = req.cookies;
  if (!adminToken) {
    throw new UnauthorizedError('Token não encontrado');
  }

  const isValid = await sessionStore.getSession(adminToken);
  if (!isValid) {
    throw new UnauthorizedError('Token inválido');
  }

  jwt.verify(adminToken, process.env.ADMIN_SECRET, (err, decoded) => {
    if (err) {
      throw new UnauthorizedError('Token inválido');
    }

    req.admin = decoded;
    req.adminToken = adminToken;
    next();
  });
}

module.exports = adminAuthentication;
