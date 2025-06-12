import express from 'express';
import mongoose from 'mongoose';
import User from '../../models/user.js'; // Assuming User model is used for creators
import { protect } from '../../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

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
router.put('/profile', protect, [
  body('name').optional().isString().trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('photo').optional().isString().trim().escape(),
  body('bio').optional().isString().trim().escape(),
  body('skills').optional().isArray(), // Assuming creators have skills
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
    if (req.body.photo) user.photo = req.body.photo;
    if (req.body.bio) user.bio = req.body.bio;
    
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
