const Err = require('../errors');

const Activity = require('../models/Activity');
const CoursesController = require('./CoursesController');

class ActivitiesController {
  async getByPk (id) {
    const activity = await Activity.findByPk(id);
    if (!activity) throw new Err.NotFoundError('Atividade não encontrada');
    return activity;
  }

  async deleteByPk (id) {
    const activity = await this.getByPk(id);
    await activity.destroy();
  }

  async createActivity (activityData) {
    await CoursesController.getTopicById(activityData.topicId);

    const createdActivity = await Activity.create(activityData);
    
    return createdActivity;
  }
}

module.exports = new ActivitiesController();
