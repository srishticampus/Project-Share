import express from 'express';
import { protect } from '../../middleware/auth.js';
import MentorRequest from '../../models/MentorRequest.js'; // MentorRequest model is used for active mentorships

const router = express.Router();

// @route   GET api/mentor/active-mentorships
// @desc    Get all accepted mentorships for the logged-in mentor
// @access  Private (Mentor only)
router.get('/active-mentorships', protect, async (req, res) => {
  try {
    const mentorId = req.user.id;
    const activeMentorships = await MentorRequest.find({ mentor: mentorId, status: 'accepted' })
      .populate('requester', 'name role') // Populate requester's name and role
      .populate('project', 'title'); // Populate project title if applicable

    res.json(activeMentorships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
