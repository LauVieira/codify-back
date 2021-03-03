/* eslint-disable no-return-await */
const Err = require('../errors');
const User = require('../models/User');
const Schemas = require('../schemas');
const bcrypt = require('bcrypt');
const axios = require('axios');
const Aws = require('../utils/Aws');

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

  async changeLastCourse (lastCourse, userId) {
    const user = await this.getUser(userId);
    
    user.lastCourse = lastCourse;
    await user.save();

    delete user.dataValues.password;

    return user;
  }

  async sendEmail (email, token, name) {
    const url = 'https://api.sendgrid.com/v3/mail/send';
    const headers = { 
      headers: { 
        Authorization: 'Bearer ' + process.env.SENDGRID_API_KEY,
      }
    };

    const data = {
      personalizations: [{
        to: [{
          email
        }]
      }],
      from: {
        email: process.env.EMAIL
      },
      subject: 'Redefinição de senha CODIFY',
      content: [{
        type: 'text/plain',
        value: `
          Olá, ${name}!\n
          Para redefinir sua senha, clique no seguinte link:\n
          ${process.env.FRONT_URL || 'http://localhost:9000'}/redefinir-senha/${token}
        `
      }]
    };

    await axios.post(url, data, headers);
  }

  async changeAvatar (id, file) {
    const user = await this.getUser(id);
    
    await Aws.uploadFile(file);
    const avatarUrl = await Aws.getFile(file);

    user.avatarUrl = avatarUrl;
    await user.save();
    
    return user;
  }
}

module.exports = new UsersControllers();
