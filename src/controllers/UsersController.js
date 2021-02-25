/* eslint-disable no-return-await */
const Err = require('../errors');
const User = require('../models/User');
const Schemas = require('../schemas');
const bcrypt = require('bcrypt');

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
      throw new Err.InvalidDataError();
    }
  }

  async checkExistingUser (email) {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Err.ConflictError('Email selecionado já existe na plataforma');
    } 
  }

  async getUser (id) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Err.NotFoundError('Usuário não encontrado');
    }
  
    return user;
  }
  
  async editUser (id, userData) {
    const user = await this.getUser(id);

    if ('password' in userData) {
      delete userData.confirmPassword;
      userData.password = bcrypt.hashSync(userData.password, 10);
    }
    
    Object.assign(user, userData);
    await user.save();
    return user;
  }
}

module.exports = new UsersControllers();
