const router = require('express').Router();
const bcrypt = require('bcrypt');
const usersController = require('../controllers/usersController');
const { user } = require('../schemas/usersSchemas');
const { sanitiseObj } = require('../utils/generalFunctions'); 

router.post('/sign-up', async (req,res) => {
    const validation = user.validate(req.body);
    if(validation.error) {
        return res.sendStatus(422);
    }
    const userData = sanitiseObj(req.body);
    const checkExistingUser = await usersController.findUserByEmail(userData.email);
    if(checkExistingUser){
        return res.sendStatus(403);
    }

    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const savedUser = await usersController.saveUser(userData.name, userData.email, hashedPassword);
    return res.send(savedUser).status(201);
})





module.exports = router;