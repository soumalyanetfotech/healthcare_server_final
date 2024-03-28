const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageController = require('../users/user.service');

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images'); // Specify the destination folder for storing images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename the image file
  },
});

const upload = multer({ storage: storage });

// POST route to upload an image
router.post('/upload', upload.single('image'), imageController.uploadImage);

module.exports = router;
