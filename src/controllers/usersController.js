/* eslint-disable no-return-await */
const { ConflictError, InvalidDataError } = require('../errors');
const User = require('../models/User');
const { user } = require('../schemas/usersSchemas');

class UsersControllers {
  saveUser(name, email, password) {
    return User.create({ name, email, password });
  }

  findUserByEmail(email) {
    return User.findOne({
      where: {
        email,
      },
    });
  }

  validateUser(userData) {
    const validation = user.validate(userData);
    if (validation.error) {
      throw new InvalidDataError(
        validation.error.details.map((e) => e.message),
      );
    }
  }

  async checkExistingUser(email) {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError(
      );
    } else {
      return existingUser;
    }
  }
}

module.exports = new UsersControllers();
