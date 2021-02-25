const Joi = require('joi');

const postPut = Joi.object({
  id: Joi.number().integer(),
  topicId: Joi.string().required(),
  youtubeLink: Joi.string().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

module.exports = {
  postPut,
};
