import express from 'express';
import auth from '../../middleware/auth.js'; // Assuming auth middleware exists
import MentorRequest from '../../models/MentorRequest.js'; // Will create this model
import Project from '../../models/Project.js'; // Assuming Project model exists
import User from '../../models/user.js'; // Assuming User model exists

const router = express.Router();

// @route   GET api/mentor/dashboard
// @desc    Get mentor dashboard data (counts)
// @access  Private (Mentor only)
router.get('/dashboard', auth, async (req, res) => {
  try {
    const mentorId = req.user.id;

    // Count mentorship requests for the mentor
    const mentorshipRequests = await MentorRequest.countDocuments({ mentor: mentorId, status: 'pending' });

    // Count active mentorships (accepted requests)
    const activeMentorships = await MentorRequest.countDocuments({ mentor: mentorId, status: 'accepted' });

    // Count projects the mentor is following (assuming a 'following' array in User model or similar)
    // For now, let's assume a simple count. This might need adjustment based on actual implementation.
    // If projects are followed by adding mentor ID to project, or project ID to mentor's user model.
    // For simplicity, let's assume a 'followedProjects' array in the User model for now.
    const mentorUser = await User.findById(mentorId);
    const projectsFollowing = mentorUser ? mentorUser.followedProjects.length : 0;


    res.json({
      mentorshipRequests,
      activeMentorships,
      projectsFollowing,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
