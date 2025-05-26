import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../../models/user.js'; // Adjust path as needed
import multer from 'multer'; // Import multer
import path from 'path'; // Import path for file paths
import fs from 'fs'; // Import fs for file system operations

const router = express.Router();

// @TODO: Move JWT_SECRET to environment variables
const JWT_SECRET = 'your_jwt_secret_key_placeholder'; // Replace with a strong secret

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

// @route   POST api/auth/register/mentor
// @desc    Register mentor user
// @access  Public
router.post(
  '/register/mentor',
  upload.single('photo'), // Use multer middleware for single photo upload
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    // Add validation for new fields if necessary
    body('contactNumber', 'Contact number is required').not().isEmpty(),
    body('areasOfExpertise', 'Areas of expertise are required').not().isEmpty(),
    body('yearsOfExperience', 'Years of experience is required').not().isEmpty().isNumeric(),
    body('credentials', 'Credentials are required').not().isEmpty(),
    body('bio', 'Bio is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, contactNumber, yearsOfExperience, credentials, bio } = req.body;
    let areasOfExpertise = [];
    try {
      areasOfExpertise = JSON.parse(req.body.areasOfExpertise);
    } catch (e) {
      return res.status(400).json({ errors: [{ msg: 'Areas of expertise must be a valid JSON array' }] });
    }

    const photoPath = req.file ? req.file.path : null; // Get photo path if uploaded

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
        role: 'mentor',
        photo: photoPath, // Save photo path
        contactNumber,
        areasOfExpertise,
        yearsOfExperience,
        credentials,
        bio,
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

export default router;
