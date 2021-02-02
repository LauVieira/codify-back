const router = require("express").Router();
const jwt = require('jsonwebtoken');
const secret = 'c0d1fy@Pr0j3ct!Gr0up4';

//const usersController = require('../controllers/usersController');
const userSchemas = require('../schemas/userSchemas');

router.post('/signIn', async (req, res) => {
    const userParams = req.body;

    const { error } = userSchemas.signIn.validate(userParams);
    if (error) return res.status(422).send({ error: error.details[0].message});

    //const user = usersController.findByEmail(userParams.email);
    //if(!user) return res.sendStatus(404);
    const user = { id: 1, email: "teste@teste.com", password: "123456"}

    //if(!bcrypt.compareSync(userInfo.password, user.password)) return res.sendStatus(422);
    
    var token = jwt.sign(user, secret, {expiresIn: 300});
 
    res.status(200).send({
        success: true,
        message: 'Token criado!!!',
        token
    });

    // create token
})

module.exports = router;