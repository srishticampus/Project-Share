import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import multer from 'multer'; // Import multer
import path from 'path';
import fs from 'fs'; // Import fs for file system operations
import User from '../../models/user.js'; // Adjust path as needed

const router = express.Router();

// @TODO: Move JWT_SECRET to environment variables
const JWT_SECRET = 'your_jwt_secret_key_placeholder'; // Replace with a strong secret

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/photos'; // Store uploaded files in the 'uploads/photos' directory
    fs.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`); // Rename the file to avoid conflicts
  },
});

const upload = multer({ storage: storage });

// @route   POST api/auth/register/collaborator
// @desc    Register collaborator user
// @access  Public
router.post(
  '/register/collaborator',
  upload.single('photo'), // Use multer middleware to handle file upload
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/),
    body('contactNumber', 'Contact number is required').not().isEmpty(),
    body('skills', 'Skills are required').isString().custom(value => {
      try {
        const skillsArray = JSON.parse(value);
        const filteredSkills = skillsArray.filter(skill => skill.trim() !== '');
        return filteredSkills.length > 0;
      } catch (error) {
        throw new Error('Invalid skills format');
      }
    }),
    body('bio', 'Bio is required').not().isEmpty(),
    body('portfolioLinks', 'Portfolio links must be an array of URLs').optional().isString().custom(value => {
      try {
        const portfolioLinksArray = JSON.parse(value);
        if (portfolioLinksArray.some(link => !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(link))) {
          throw new Error('Invalid portfolio link format');
        }
        return true;
      } catch (error) {
        throw new Error('Invalid portfolio links format');
      }
    }),
    // Photo is optional, no server-side validation needed for file upload itself
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, contactNumber, skills, portfolioLinks, bio } = req.body;
    const photoPath = req.file ? req.file.path : ''; // Get the path of the uploaded photo, default to empty string

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
        contactNumber,
        skills: skills ? JSON.parse(skills) : [],
        portfolioLinks: portfolioLinks ? JSON.parse(portfolioLinks) : [],
        bio,
        photo: photoPath, // Save photo path
        role: 'collaborator',
        isApproved: false, // Set isApproved to false for new collaborators
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
