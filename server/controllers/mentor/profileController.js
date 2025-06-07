import express from 'express';
import mongoose from 'mongoose';
import User from '../../models/user.js'; // Assuming User model is used for mentors
import { protect } from '../../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// PUT /api/mentor/profile - Update mentor profile
router.put('/profile', protect, [
  body('name').optional().isString().trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('photo').optional().isString().trim().escape(),
  body('contactNumber').optional().isString().trim().escape(),
  body('skills').optional().isArray(), // Assuming mentors might have skills
  body('portfolioLinks').optional().isArray(), // Assuming mentors might have portfolio links
  body('areasOfExpertise').optional().isArray(),
  body('yearsOfExperience').optional().isNumeric(),
  body('credentials').optional().isString().trim().escape(),
  body('bio').optional().isString().trim().escape(),
  // Add more mentor-specific validation rules as needed
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
    if (req.body.contactNumber) user.contactNumber = req.body.contactNumber;
    
    // Handle array fields that might be sent as JSON strings
    if (req.body.skills) {
      try {
        user.skills = JSON.parse(req.body.skills);
      } catch (e) {
        user.skills = req.body.skills;
      }
    }
    if (req.body.portfolioLinks) {
      try {
        user.portfolioLinks = JSON.parse(req.body.portfolioLinks);
      } catch (e) {
        user.portfolioLinks = req.body.portfolioLinks;
      }
    }
    if (req.body.areasOfExpertise) {
      try {
        user.areasOfExpertise = JSON.parse(req.body.areasOfExpertise);
      } catch (e) {
        user.areasOfExpertise = req.body.areasOfExpertise;
      }
    }

    if (req.body.yearsOfExperience) user.yearsOfExperience = req.body.yearsOfExperience;
    if (req.body.credentials) user.credentials = req.body.credentials;
    if (req.body.bio) user.bio = req.body.bio;
    // Update other mentor-specific fields as needed

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
