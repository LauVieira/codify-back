const Joi = require('joi');

const postPut = Joi.object({
  id: Joi.number().integer(),
  topicId: Joi.number().integer().required(),
  activityId: Joi.number().integer(),
  chapterId: Joi.number().integer(),
  courseId: Joi.number().integer(),
  order: Joi.number().integer(),
  youtubeLink: Joi.string().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

module.exports = {
  postPut,
};
