const Joi = require('joi');

const post = Joi.object({
  alt: Joi.string(),
  background: Joi.string().required(),
  description: Joi.string().required(),
  photo: Joi.string().required(),
  title: Joi.string().required(),
  type: Joi.string().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

const postTopic = Joi.object({
  title: Joi.string().required(),
  chapterId: Joi.number().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

const postChapter = Joi.object({
  title: Joi.string().required(),
  courseId: Joi.number().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

module.exports = {
  post,
  postTopic,
  postChapter
};
