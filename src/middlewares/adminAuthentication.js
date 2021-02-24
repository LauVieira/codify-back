const jwt = require('jsonwebtoken');
const { UnauthorizedError }= require('../errors');
const sessionStore = require('../utils/redis');

async function adminAuthentication (req, res, next) {
  const { adminToken } = req.cookies;
  if (!adminToken) {
    throw new UnauthorizedError('Token não encontrado');
  }

  try {
    const admin = jwt.verify(adminToken, process.env.ADMIN_SECRET);
    const session = await sessionStore.getSession(adminToken);
    if (!session || session !== admin.username) {
      throw new UnauthorizedError('Token inválido');
    }

    req.admin = admin;
    req.adminToken = adminToken;
    
    next();
  } catch (err) {
    throw new UnauthorizedError('Token inválido');
  }
}

module.exports = adminAuthentication;
