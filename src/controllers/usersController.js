const User = require('../models/User');

async function saveUser(name, email, password) {
  return User.create({ name, email, password });
}

function findUserByEmail(email) {
  return User.findOne({ where: { email } });
}

module.exports = {
  saveUser,
  findUserByEmail,
};
