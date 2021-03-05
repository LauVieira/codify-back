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

module.exports = upload;
