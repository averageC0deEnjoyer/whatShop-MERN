//for image upload

import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

//where we want to store the image
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); //null for error
  },
  filename(req, file, cb) {
    console.log(file);
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

//check file type (only allow image file extension)
function checkFileTypes(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only');
  }
}

const upload = multer({
  storage,
  // checkFileTypes,
});

router.post('/', upload.single('image'), (req, res) => {
  res.send({
    message: 'Image uploaded',
    image: `/${req.file.path}`,
  });
});

export default router;
