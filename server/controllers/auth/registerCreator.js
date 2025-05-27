import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../../models/user.js'; // Adjust path as needed
import multer from 'multer'; // Import multer
import path from 'path'; // Import path for file paths
import fs from 'fs'; // Import fs for file system operations

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/photos'; // Directory to save photos
    fs.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// @route   POST api/auth/register/creator
// @desc    Register creator user
// @access  Public
router.post(
  '/register/creator',
  upload.single('photo'), // Use multer middleware for single photo upload
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    // Removed username validation
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const photoPath = req.file ? req.file.path : ''; // Get photo path if uploaded, default to empty string

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
        role: 'creator',
        photo: photoPath, // Save photo path
        isApproved: false, // Set isApproved to false for new creators
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Inform the user that their account is pending approval
      res.status(200).json({ msg: 'Registration successful. Your account is pending admin approval.' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

export default router;
