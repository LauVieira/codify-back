const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

async function userAuthentication(req, res, next) {
  const { token } = req.cookies;
  if (!token) throw new UnauthorizedError('Token não encontrado');

  await jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) throw new UnauthorizedError('Token inválido');
    req.user = decoded.selectedUser;
  });
  next();
}

module.exports = userAuthentication;
