const Joi = require('joi');

const post = Joi.object({
  id: Joi.number(),
  alt: Joi.string(),
  background: Joi.string().required(),
  description: Joi.string().required(),
  photo: Joi.string().required(),
  title: Joi.string().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

module.exports = {
  post
};
