require('../schema/DoctorInfo');

const Image=mongoose.model("DoctorInfo");

// Function to handle image upload
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Create a new Image document
    const newImage = new Image({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      imagePath: req.file.path, // Path where the image is stored
    });

    // Save the image document to MongoDB
    await newImage.save();

    return res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
