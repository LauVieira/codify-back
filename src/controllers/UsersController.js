/* eslint-disable no-return-await */
const { ConflictError, InvalidDataError } = require('../errors');
const User = require('../models/User');
const Schemas = require('../schemas');

class UsersControllers {
  saveUser (name, email, password) {
    return User.create({ name, email, password });
  }

  findUserByEmail (email) {
    return User.findOne({
      where: {
        email,
      },
    });
  }

  validateUser (userData) {
    const validation = Schemas.users.signUp.validate(userData);
    if (validation.error) {
      throw new InvalidDataError();
    }
  }

  async checkExistingUser (email) {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email selecionado já existe na plataforma');
    } 
  }
}

module.exports = new UsersControllers();
