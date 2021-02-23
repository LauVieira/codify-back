const joi = require('joi');

const signUp = joi.object({
  name: joi.string().pattern(/^[A-z\u00C0-\u00ff ]+$/).required(),
  email: joi.string().email().pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/).required(),
  password: joi.string().pattern(/^\S{6,}$/).required(),
  confirmPassword: joi.ref('password'),
});

const signIn = joi.object({
  email: joi.string().email().pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/).required(),
  password: joi.string().pattern(/^\S{6,}$/).required(),
});

module.exports = {
  signUp,
  signIn,
};
