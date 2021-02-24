const Err = require('../errors');
const sequelize = require('../utils/database');

const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');
const Theory = require('../models/Theory');

class TheoriesController {
  getAll (limit = null, offset = null, filter = {}) {
    return Theory.findAndCountAll({ 
      where: filter, 
      limit, 
      offset,
      include: {
        model: Activity,
        include: {
          model: Topic,
          include: {
            model: Chapter
          }
        }
      },
      attributes: [
        'id',
        'youtubeLink',
        [sequelize.col('activity."topicId"'), 'topicId'],
        [sequelize.col('activity.topic."chapterId"'), 'chapterId'],
        [sequelize.col('activity.topic.chapter."courseId"'), 'courseId'],
      ],
    });
  }
}

module.exports = new TheoriesController();
