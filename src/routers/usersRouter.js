const router = require('express').Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const { sanitiseObj } = require('../utils/generalFunctions');
const UsersController = require('../controllers/UsersController');
const UploadController = require('../controllers/UploadController');
const { validateUser, userAuthentication } = require('../middlewares');
const Schemas = require('../schemas');
const { InvalidDataError, UnauthorizedError } = require('../errors/');
const { runInNewContext } = require('vm');

router.post('/sign-up', validateUser, async (req, res) => {
  const { name, email, password } = req.userData;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const savedUser = await UsersController.saveUser(
    name,
    email,
    hashedPassword,
  );
  
  delete savedUser.password;
  res.status(201).send(savedUser);
});

router.post('/sign-in', async (req, res) => {
  const validation = Schemas.users.signIn.validate(req.body);
  if (validation.error) {
    throw new InvalidDataError();
  }

  const userData = sanitiseObj(req.body);
  let selectedUser = await UsersController.findUserByEmail(userData.email);
  if (!selectedUser) {
    throw new UnauthorizedError('Email ou senha estão incorretos');
  }

  const valid = bcrypt.compareSync(userData.password, selectedUser.password);
  if (!valid) {
    throw new UnauthorizedError('Email ou senha estão incorretos');
  }

  selectedUser = selectedUser.dataValues;
  delete selectedUser.password;
  const token = jwt.sign(selectedUser, process.env.SECRET);

  const cookieOptions = {};

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'none';
  }

  res.cookie('token', token, cookieOptions);
  res.status(200).send(selectedUser);
});

router.post('/sign-out', userAuthentication, (req, res) => {
  res.clearCookie('token');
  
  res.status(200).send({ message: 'Sign-out efetuado com sucesso' });
});

router.post('/profile', (req, res) => {
  const storage = multer.diskStorage({
    destination: '../utils/temp', 
    filename: function (req, res, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({
    storage,
    fileFilter: function (req, file, cb){
      checkFileType(file, cb);
    }
  }).single('avatar');
  
  upload(req, res, async (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (req.file === undefined) res.status(400).send(err);
      else {
        await UploadController.uploadFile(req.file);
        res.sendStatus(200);
      }
    }
  });
});

function checkFileType (file, cb){
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType){
    return cb(null, true);
  } else {
    cb('Error: Images only');
  }
}

module.exports = router;
