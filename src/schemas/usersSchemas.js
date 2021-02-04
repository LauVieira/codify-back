const joi = require('joi');

const user = joi.object({
  name: joi.string().pattern(/^[A-z\u00C0-\u00ff ]+$/).required(),
  email: joi.string().email().pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/).required(),
  password: joi.string().pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).required().min(6),
  confirmPassword: joi.string().required().valid(joi.ref('password')),
});

module.exports = {
  user,
};
