const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

async function userAuthentication(req, res, next) {
  const { token } = req.headers;
  if (!token) throw new UnauthorizedError('Token not found');

  await jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) throw new UnauthorizedError('Token invalid');
    req.user = decoded.selectedUser;
  });
  next();
}

module.exports = userAuthentication;

// no app: if (err instanceof UnauthorizedError) res.status(401).send(err.message);
