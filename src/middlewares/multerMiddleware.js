const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: function (req, file, cb){
    checkFileType(file, cb);
  }
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

function multerMiddleware (req, res, next) {
  upload.single('avatar');

  if (req.file === undefined) {
    res.sendStatus(400);
  }
  
  next();
}

module.exports = multerMiddleware;
