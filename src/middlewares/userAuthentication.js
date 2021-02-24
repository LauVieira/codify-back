const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');
const sessionStore = require('../utils/redis');

async function userAuthentication (req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthorizedError('Token não encontrado');
  }

  const isValid = await sessionStore.getSession(token);
  if (!isValid) {
    throw new UnauthorizedError('Token inválido');
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      throw new UnauthorizedError('Token inválido');
    }

    req.user = decoded;
    req.token = token;
    
    next();
  });
}

module.exports = userAuthentication;
