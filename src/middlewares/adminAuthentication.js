const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');
const AdminController = require('../controllers/AdminController');

async function adminAuthentication (req, res, next) {
  const { token } = req.cookies;
  if (!token) throw new UnauthorizedError('Token não encontrado');

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) throw new UnauthorizedError('Token inválido');

    await AdminController.validateUserAndPassword(decoded.admin);

    req.admin = decoded.admin;
    next();
  });
}

module.exports = adminAuthentication;
