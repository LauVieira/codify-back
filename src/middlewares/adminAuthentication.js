const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

async function adminAuthentication (req, res, next) {
  const { adminToken } = req.cookies;
  if (!adminToken) throw new UnauthorizedError('Token não encontrado');

  jwt.verify(adminToken, process.env.ADMIN_SECRET, (err, decoded) => {
    if (err) throw new UnauthorizedError('Token inválido');

    req.admin = decoded.admin;
    next();
  });
}

module.exports = adminAuthentication;
