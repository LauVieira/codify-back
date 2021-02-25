require('dotenv-flow').config({ silent: true });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { setSession } = require('../../src/utils/redis');

const database = require('../../src/utils/database');

function convertToJson (entity) {
  entity[0][0].createdAt = entity[0][0].createdAt.toJSON();
  entity[0][0].updatedAt = entity[0][0].updatedAt.toJSON();

  return entity[0][0];
}

class Helpers {
  async createUser (email='test@test.com') {
    const hashedPassword = bcrypt.hashSync('123456', 10);
    const values = ['teste sobrenome', email, hashedPassword];
  
    let user = await database.query(`
      INSERT INTO users (name, email, password) values ('${values[0]}', '${values[1]}', '${values[2]}') RETURNING *;
    `);
    
    user = convertToJson(user);
    return user;
  }

  async createAdmin () {
    const hashedPassword = bcrypt.hashSync('123456', 10);
    const values = ['admin', hashedPassword];

    let admin = await database.query(`
      INSERT INTO admins (username, password) values ('${values[0]}', '${values[1]}') RETURNING *;
    `);

    admin = convertToJson(admin);

    return admin;
  }

  async createCourse () {
    const values = ['Course title', 'Course description', 'Course photo', 'Course alt', 'Course background'];
    let course = await database.query(`
      INSERT INTO courses (title, description, photo, alt, background) VALUES ('${values[0]}', '${values[1]}', '${values[2]}', '${values[3]}', '${values[4]}') RETURNING *;
    `);

    course = convertToJson(course);

    return course;
  }

  async createChapter (courseId) {
    const values = ['Chapter title', courseId];
    let chapter = await database.query(`
      INSERT INTO chapters (title, "courseId") VALUES ('${values[0]}', '${values[1]}') RETURNING *;
    `);
    
    chapter = convertToJson(chapter);

    return chapter;
  }

  async createTopic (chapterId) {
    const values = ['Topic title', chapterId];
    let topic = await database.query(`
      INSERT INTO topics (title, "chapterId") VALUES ('${values[0]}', '${values[1]}') RETURNING *;
    `);
    
    topic = convertToJson(topic);

    return topic;
  }

  async createActivityExercise (topicId) {
    let values = ['exercise', topicId, 2];
    let activityEx = await database.query(`
      INSERT INTO activities (type, "topicId", "order") VALUES ('${values[0]}', '${values[1]}', '${values[2]}') RETURNING *;
    `);

    activityEx = convertToJson(activityEx);
    values = ['Title exercise', activityEx.id];

    let exercise = await database.query(`
      INSERT INTO exercises ("title", "activityId") VALUES ('${values[0]}', '${values[1]}') RETURNING *;
    `);
    exercise = convertToJson(exercise);

    return { activityEx, exercise };
  }

  async createActivityTheory (topicId) {
    let values = ['theory', topicId, 1];
    let activityTh = await database.query(`
      INSERT INTO activities (type, "topicId", "order") VALUES ('${values[0]}', '${values[1]}', '${values[2]}') RETURNING *;`
    );

    activityTh = convertToJson(activityTh);
    values = ['Test youtube', activityTh.id];

    let theory = await database.query(`
      INSERT INTO theories ("youtubeLink", "activityId") VALUES ('${values[0]}', '${values[1]}') RETURNING *;
    `);
    theory = convertToJson(theory);

    return { activityTh, theory };
  }

  async createCourseUsers (userId, courseId) {
    let courseUser = await database.query(`
      INSERT INTO "courseUsers" ("userId", "courseId") VALUES ('${userId}', '${courseId}') RETURNING *;
    `);
    
    courseUser = convertToJson(courseUser);

    return courseUser;
  }

  async createActivityUsers (userId, activityId, done=true) {
    let activityUser = await database.query(`
      INSERT INTO "activityUsers" ("userId", "activityId", done) VALUES ('${userId}', '${activityId}', '${done}') RETURNING *;
    `);
    
    activityUser = convertToJson(activityUser);

    return activityUser;
  }
  
  async createAdminToken (admin) {
    delete admin.password;
    const adminToken = jwt.sign(
      admin,
      process.env.ADMIN_SECRET
    );
    
    await setSession(adminToken, admin.username);
    return adminToken;
  }

  async createToken (user) {
    delete user.password;
    const token = jwt.sign(
      user,
      process.env.SECRET
    );
    
    await setSession(token, user.email);
    return token;
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
