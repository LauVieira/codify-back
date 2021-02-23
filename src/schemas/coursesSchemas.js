const Joi = require('joi');

const post = Joi.object({
  id: Joi.number().integer(),
  alt: Joi.string(),
  background: Joi.string().required(),
  description: Joi.string().required(),
  photo: Joi.string().required(),
  title: Joi.string().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

const postTopic = Joi.object({
  title: Joi.string().required(),
  chapterId: Joi.number().integer().required(),
});

const putTopic = Joi.object({
  id: Joi.number().integer(),
  title: Joi.string(),
  chapterId: Joi.number().integer(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

const postChapter = Joi.object({
  title: Joi.string().required(),
  courseId: Joi.number().integer().required(),
});

const putChapter = Joi.object({
  id: Joi.number().integer(),
  title: Joi.string(),
  courseId: Joi.number().integer(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

module.exports = {
  post,
  postTopic,
  postChapter,
  putChapter,
  putTopic
};
