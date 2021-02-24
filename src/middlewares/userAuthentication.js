const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');
const sessionStore = require('../utils/redis');

async function userAuthentication (req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthorizedError('Token não encontrado');
  }

  try {
    const user = jwt.verify(token, process.env.SECRET);
    const session = await sessionStore.getSession(token);
    if (!session || session !== user.email) {
      throw new UnauthorizedError('Token inválido');
    }
    req.user = user;
    req.token = token;
    
    next();
  } catch (err) {
    console.error(err);
    throw new UnauthorizedError('Token inválido');
  }
}

module.exports = userAuthentication;
