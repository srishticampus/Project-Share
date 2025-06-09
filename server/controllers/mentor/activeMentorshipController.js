import express from 'express';
import { protect } from '../../middleware/auth.js';
import MentorRequest from '../../models/MentorRequest.js';
import Message from '../../models/Message.js'; // Import Message model
import Project from '../../models/Project.js'; // Import Project model

const router = express.Router();

// @route   GET api/mentor/active-mentorships
// @desc    Get all accepted mentorships for the logged-in mentor with derived details
// @access  Private (Mentor only)
router.get('/active-mentorships', protect, async (req, res) => {
  try {
    const mentorId = req.user.id;
    let activeMentorships = await MentorRequest.find({ mentor: mentorId, status: 'accepted' })
      .populate('requester', 'name role')
      .populate('project', 'title');

    // Process each mentorship to add derived details
    activeMentorships = await Promise.all(activeMentorships.map(async (mentorship) => {
      // Calculate duration
      const startDate = new Date(mentorship.requestDate);
      const now = new Date();
      const diffTime = Math.abs(now - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let duration = '';
      if (diffDays < 30) {
        duration = `${diffDays} days ongoing`;
      } else {
        const diffMonths = Math.floor(diffDays / 30);
        duration = `${diffMonths} months ongoing`;
      }

      // Find last message date
      const lastMessage = await Message.findOne({
        $or: [
          { sender: mentorId, receiver: mentorship.requester._id },
          { sender: mentorship.requester._id, receiver: mentorId }
        ]
      }).sort({ timestamp: -1 }); // Get the latest message

      return {
        ...mentorship.toObject(), // Convert Mongoose document to plain object
        duration,
        mentorshipGoals: mentorship.message, // Using the initial message as a proxy for goals
        lastMessageDate: lastMessage ? lastMessage.timestamp : null,
        status: mentorship.status, // Explicitly include status
      };
    }));

    res.json(activeMentorships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/mentor/mentorships/:id
// @desc    Get details of a specific mentorship for the logged-in mentor
// @access  Private (Mentor only)
router.get('/mentorships/:id', protect, async (req, res) => {
  try {
    const mentorId = req.user.id;
    const mentorshipId = req.params.id;

    let mentorship = await MentorRequest.findOne({ _id: mentorshipId, mentor: mentorId, status: 'accepted' })
      .populate('requester', 'name role email photo contactNumber skills bio portfolioLinks') // Populate more user fields
      .populate('project', 'title');

    if (!mentorship) {
      return res.status(404).json({ msg: 'Mentorship not found or not active for this mentor' });
    }

    // Calculate duration
    const startDate = new Date(mentorship.requestDate);
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let duration = '';
    if (diffDays < 30) {
      duration = `${diffDays} days ongoing`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      duration = `${diffMonths} months ongoing`;
    }

    // Find last message date
    const lastMessage = await Message.findOne({
      $or: [
        { sender: mentorId, receiver: mentorship.requester._id },
        { sender: mentorship.requester._id, receiver: mentorId }
      ]
    }).sort({ timestamp: -1 });

    let projects = [];
    if (mentorship.requester.role === 'creator') {
      projects = await Project.find({ creator: mentorship.requester._id }).select('title description status');
    } else if (mentorship.requester.role === 'collaborator') {
      projects = await Project.find({ collaborators: mentorship.requester._id }).select('title description status');
    }

    const detailedMentorship = {
      ...mentorship.toObject(),
      duration,
      mentorshipGoals: mentorship.message,
      lastMessageDate: lastMessage ? lastMessage.timestamp : null,
      status: mentorship.status,
      requesterProjects: projects, // Add the fetched projects
    };

    res.json(detailedMentorship);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
