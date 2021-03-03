const AdminController = require('../controllers/AdminController');
const { sanitiseObj } = require('../utils/generalFunctions');

async function adminLogin (req, res, next) {
    AdminController.validateEntriesData(req.body);
    const userData = sanitiseObj(req.body);

    const userAdmin = await AdminController.validateUserAndPassword(userData);

    req.admin = userAdmin;
    next();
}

module.exports = adminLogin;
