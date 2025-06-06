import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/user.js';

const router = express.Router();

// @route   GET api/users/mentors
// @desc    Get a list of all users with role 'mentor'
// @access  Private (Accessible by authenticated users like Project Creators/Collaborators)
router.get('/mentors', protect, async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password'); // Exclude password
    res.json(mentors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

export default router;
