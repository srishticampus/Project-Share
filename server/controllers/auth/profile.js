import express from 'express';
import mongoose from 'mongoose';
import User from '../../models/user.js';
import { protect } from '../../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.get('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming 'protect' middleware adds user info to the request

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/users/me', protect, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming 'protect' middleware adds user info to the request

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/profile', protect, [
  body('name').optional().isString().trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('photo').optional().isString().trim().escape(),
  body('contactNumber').optional().isString().trim().escape(),
  body('skills').optional().isArray(),
  body('portfolioLinks').optional().isArray(),
  body('areasOfExpertise').optional().isArray(),
  body('yearsOfExperience').optional().isNumeric(),
  body('credentials').optional().isString().trim().escape(),
  body('bio').optional().isString().trim().escape(),
  // Add more validation rules for other fields as needed
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id;

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
    if (req.body.skills) user.skills = req.body.skills;
    if (req.body.portfolioLinks) user.portfolioLinks = req.body.portfolioLinks;
    if (req.body.areasOfExpertise) user.areasOfExpertise = req.body.areasOfExpertise;
    if (req.body.yearsOfExperience) user.yearsOfExperience = req.body.yearsOfExperience;
    if (req.body.credentials) user.credentials = req.body.credentials;
    if (req.body.bio) user.bio = req.body.bio;
    // Update other fields as needed

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;