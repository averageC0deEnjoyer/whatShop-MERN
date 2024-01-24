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
    // console.log(file);
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

//check file type (only allow image file extension)
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
});

const uploadSingleImage = upload.single('image');

router.post('/', uploadSingleImage, (req, res) => {
  res.send({
    message: 'Image uploaded',
    image: `/${req.file.path}`,
  });
});

export default router;
