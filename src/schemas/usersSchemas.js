const joi = require('joi');

const signUp = joi.object({
  name: joi.string().pattern(/^[A-z\u00C0-\u00ff ]+$/).required(),
  email: joi.string().email().required(),
  password: joi.string().pattern(/^\S{6,}$/).required(),
  confirmPassword: joi.ref('password'),
});

const signIn = joi.object({
  email: joi.string().email().required(),
  password: joi.string().pattern(/^\S{6,}$/).required(),
});

const putUser = joi.object({
  name: joi.string().pattern(/^[A-z\u00C0-\u00ff ]+$/),
  email: joi.string().email(),
  password: joi.string().pattern(/^\S{6,}$/),
  confirmPassword: joi.ref('password'),
});

const forgot = joi.object({
  email: joi.string().email().required()
});

const redefine = joi.object({
  password: joi.string().pattern(/^\S{6,}$/).required(),
  confirmPassword: joi.ref('password'),
  token: joi.string().guid({ version: 'uuidv4' }).required()
});

module.exports = {
  signUp,
  signIn,
  putUser,
  forgot,
  redefine
};
