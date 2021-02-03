const joi = require('joi');

const user = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required().min(6),
  confirmPassword: joi.string().required().valid(joi.ref('password')),
});

const signIn = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

module.exports = {
  user,
  signIn,
};
