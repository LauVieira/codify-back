require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const database = require('../../src/utils/database');

class Helpers {
  async createUser (name = 'teste', email = 'test@test.com', password = '123456') {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await database.query(`
      INSERT INTO users (name, email, password) values ('${name}', '${email}', '${hashedPassword}') RETURNING *
    `);
  
    return user[0][0];
  }

  async createAdmin (username = 'admin', password = '123456') {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const admin = await database.query(`
      INSERT INTO admins (username, password) values ('${username}', '${hashedPassword}') RETURNING *
    `);
  
    return admin[0][0];
  }

  createToken (user) {
    delete user.password;
    const token = jwt.sign(
      user,
      process.env.SECRET
    );

    return token;
  }

  createAdminToken (admin) {
    delete admin.password;
    const adminToken = jwt.sign(
      admin,
      process.env.ADMIN_SECRET
    );

    return adminToken;
  }

  eraseDatabase () {
    return database.query(`
      DELETE FROM "courseUsers";
      DELETE FROM "activityUsers";
      DELETE FROM exercises;
      DELETE FROM theories;
      DELETE FROM activities;
      DELETE FROM topics;
      DELETE FROM chapters;
      DELETE FROM users;
      DELETE FROM courses;
      DELETE FROM admins;
    `);
  }
}

module.exports = new Helpers();
