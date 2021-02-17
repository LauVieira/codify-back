const Joi = require('joi');

const login = Joi.object({
    username: Joi.string().alphanum().trim().required(),
    password: Joi.string().required()
});

module.exports = {
    login
};
