import express from 'express';
import { protect } from '../../middleware/auth.js';
import MentorRequest from '../../models/MentorRequest.js';
import User from '../../models/user.js'; // To populate mentee details
import Project from '../../models/Project.js'; // To populate project details if applicable

const router = express.Router();

// @route   GET api/mentor/mentees
// @desc    Get a list of active mentees for the logged-in mentor
// @access  Private (Mentor only)
router.get('/mentees', protect, async (req, res) => {
  try {
    const mentorId = req.user.id;

    // Find all accepted mentorship requests where the logged-in user is the mentor
    const mentees = await MentorRequest.find({ mentor: mentorId, status: 'accepted' })
      .populate('requester', 'name role photo') // Populate requester's name, role, and photo
      .populate('project', 'title'); // Populate project title if applicable

    res.json(mentees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
