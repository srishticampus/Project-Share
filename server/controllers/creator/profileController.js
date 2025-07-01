import express from 'express';
import mongoose from 'mongoose';
import User from '../../models/user.js'; // Assuming User model is used for creators
import { protect } from '../../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// GET /api/creator/profile/:id - Get creator profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid creator ID' });
    }

    const creator = await User.findOne({ _id: id, role: 'creator' });

    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    // Return public profile data
    res.status(200).json(creator);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/creator/profile - Update creator profile
router.put('/profile', protect, upload.single('photo'), [ // Add upload.single('photo') middleware
  body('name').optional().isString().trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('bio').optional().isString().trim().escape(),
  body('skills').optional().custom((value, { req }) => {
    if (!value) {
      return true; // Optional field, no value means no validation needed
    }
    try {
      const parsedSkills = JSON.parse(value);
      if (!Array.isArray(parsedSkills)) {
        throw new Error('Skills must be an array.');
      }
      if (!parsedSkills.every(skill => typeof skill === 'string')) {
        throw new Error('All skills must be strings.');
      }
      return true;
    } catch (e) {
      throw new Error('Skills must be a valid JSON array of strings.');
    }
  }),
  // Add more creator-specific validation rules as needed
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id; // User ID from protect middleware

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.bio) user.bio = req.body.bio;
    
    // Handle photo upload
    if (req.file) {
      user.photo = `/uploads/${req.file.filename}`; // Store the path to the uploaded file
    } else if (req.body.photo === 'null' || req.body.photo === '') {
      // If photo is explicitly set to null/empty, clear it
      user.photo = null;
    }

    // Handle array fields that might be sent as JSON strings
    if (req.body.skills) {
      try {
        user.skills = JSON.parse(req.body.skills);
      } catch (e) {
        user.skills = req.body.skills;
      }
    }

    // Update other creator-specific fields as needed

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
