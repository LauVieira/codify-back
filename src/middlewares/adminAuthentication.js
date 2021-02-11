const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

async function adminAuthentication (req, res, next) {
  const { token } = req.cookies;
  if (!token) throw new UnauthorizedError('Token não encontrado');

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) throw new UnauthorizedError('Token inválido');
    req.admin = decoded.admin;
    next();
  });
}

module.exports = adminAuthentication;
