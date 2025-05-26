import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/user.js';

const router = express.Router();

// @route   GET api/users/mentors
// @desc    Get a list of all users with role 'mentor'
// @access  Private (Accessible by authenticated users like Project Creators/Collaborators)
router.get('/users/mentors', auth, async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password'); // Exclude password
    res.json(mentors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
