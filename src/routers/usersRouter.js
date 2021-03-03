const router = require('express').Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const { sanitiseObj } = require('../utils/generalFunctions');
const UsersController = require('../controllers/UsersController');
const { validateUser, userAuthentication, schemaMiddleware, userLogin } = require('../middlewares');
const usersSchema = require('../schemas/usersSchemas');
const Err = require('../errors');
const redis = require('../utils/redis');
const CoursesController = require('../controllers/CoursesController');
const UploadController = require('../controllers/UploadController');

const { runInNewContext } = require('vm');

router.post('/sign-up', validateUser, async (req, res) => {
  const { name, email, password } = req.userData;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const savedUser = await UsersController.saveUser(
    name,
    email,
    hashedPassword,
  );
  
  delete savedUser.dataValues.password;
  res.status(201).send(savedUser.dataValues);
});

router.post('/sign-in', userLogin, async (req, res) => {
  delete req.user.password;
  const token = jwt.sign(req.user, process.env.SECRET);

  await redis.setSession(token, req.user.email);

  const cookieOptions = {};

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'none';
  }

  res.cookie('token', token, cookieOptions);
  res.status(200).send(req.user);
});

router.put('/:id', userAuthentication, schemaMiddleware(usersSchema.putUser), async (req, res) => {
  const id = Number(req.params.id);
  const sanitized = sanitiseObj(req.body);

  const updatedUser = await UsersController.editUser(id, sanitized);

  delete updatedUser.dataValues.password;
  res.status(200).send(updatedUser.dataValues);
});

router.post('/sign-out', userAuthentication, async (req, res) => {
  await redis.deleteSession(req.token);
  res.clearCookie('token');
  
  res.sendStatus(200);
});

router.post('/forgot-password', schemaMiddleware(usersSchema.forgot), async (req, res) => {
  const user = await UsersController.findUserByEmail(req.body.email);
  if (!user) {
    return res.sendStatus(202);
  }

  const token = await redis.setItem(user.id);

  await UsersController.sendEmail(user.email, token, user.name);
  res.sendStatus(202);
});

router.post('/redefine-password', schemaMiddleware(usersSchema.redefine), async (req, res) => {
  const userId = await redis.getItem(req.body.token);
  const { password } = sanitiseObj(req.body);

  if (!userId) {
    throw new Err.ForbiddenError('Token inválido ou expirado');
  }

  await UsersController.editUser(userId, { password });
  res.sendStatus(200);
});

router.post('/last-course/:id', userAuthentication, async (req, res) => {
  const id = +req.params.id;
  await CoursesController.getCourse(id);

  const user = await UsersController.changeLastCourse(id, req.user.id);
  res.status(200).send(user);
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
