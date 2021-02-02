const User = require('../models/User');

async function saveUser(name, email, password) {
  return await User.create({ name, email, password });
}

async function findUserByEmail(email) {
  return await User.findOne({ where:{ email } });
}

module.exports = {
  saveUser,
  findUserByEmail,
}