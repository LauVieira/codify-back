const { userSchema } = require('../schemas/usersSchemas');

module.exports = (req, res, next) => {
    const { error } = userSchema.validate(req.body);

    if (error == null) {
	    return res.sendStatus(422);
		}

    next();
}