require('dotenv-flow').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const database = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class Helpers {
  async createUser () {
    const hashedPassword = bcrypt.hashSync('123456', 10);
    const userValues = ['teste', 'test@test.com', hashedPassword];
  
    const user = await database.query(`
      INSERT INTO users (name, email, password) values ($1, $2, $3) RETURNING *`, userValues
    );
  
    return user.rows[0];
  }

  async createAdmin () {
    const hashedPassword = bcrypt.hashSync('123456', 10);
    const adminValues = ['admin', hashedPassword];
    const admin = await database.query(`
      INSERT INTO admins (username, password) values ($1, $2) RETURNING *`, adminValues
    );
  
    return admin.rows[0];
  }

  createToken (user) {
    delete user.password;
    const token = jwt.sign(
      user,
      process.env.SECRET
    );

    return token;
  }

  async createCourses () {
    const values = ['Test title', 'Test description', 'Test photo', 'Test alt', 'Test background'];
    const course = await db.query(`
      INSERT INTO courses (title, description, photo, alt, background) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [values]
    );

    return course.rows[0];
  }

  async createTopics () {
    const values = ['Test title', 'Test description', 'Test photo', 'Test alt', 'Test background'];
    const course = await db.query(`
      INSERT INTO courses (title, description, photo, alt, background) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [values]
    );

    return course.rows[0];
  }

  async createCourses () {
    const values = ['Test title', 'Test description', 'Test photo', 'Test alt', 'Test background'];
    const course = await db.query(`
      INSERT INTO courses (title, description, photo, alt, background) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [values]
    );

    return course[0].rows;
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
