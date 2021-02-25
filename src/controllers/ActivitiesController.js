const Err = require('../errors');

const Activity = require('../models/Activity');

class ActivitiesController {
  async getByPk (id) {
    const activity = await Activity.findByPk(id);
    if (!activity) throw new Err.NotFoundError('Atividade não encontrada');
    return activity;
  }

  async deleteByPk (id) {
    const activity = await this.getByPk(id);
    activity.destroy();
  }
}

module.exports = new ActivitiesController();
