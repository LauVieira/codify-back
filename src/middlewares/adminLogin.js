const AdminController = require('../controllers/AdminController');
const { sanitiseObj } = require('../utils/generalFunctions');

async function adminLogin (req, res, next) {
    const userData = sanitiseObj(req.body);
    AdminController.validateEntriesData(userData);

    const userAdmin = await AdminController.validateUserAndPassword(userData);

    req.admin = userAdmin;
    next();
}

module.exports = adminLogin;
