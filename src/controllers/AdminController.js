const Admin = require('../models/Admin');
const Schemas = require('../schemas');
const bcrypt = require('bcrypt');
const Err = require('../errors');

class AdminController {
    validateEntriesData (userData) {
        const validation = Schemas.admin.login.validate(userData);

        if (validation.error) {
            throw new Err.InvalidDataError('Não foi possível processar os dados enviados');
        }
    }

    async validateUserAndPassword (userData) {
        const { username, password } = userData;
        const admin = await Admin.findOne({ where: { username } });

        if (!admin) {
            throw new Err.UnauthorizedError('Username ou senha estão incorretos');
        }

        const passwordValid = bcrypt.compareSync(password, admin.password);
        if (!passwordValid) {
            throw new Err.UnauthorizedError('Username ou senha estão incorretos');
        }

        return admin.dataValues;
    }
}

module.exports = new AdminController();
