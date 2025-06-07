import express from 'express';
import { protect } from '../../middleware/auth.js';
import MentorRequest from '../../models/MentorRequest.js';
import User from '../../models/user.js';
import Project from '../../models/Project.js'; // Assuming Project model exists
import Notification from '../../models/Notification.js'; // Import Notification model
import { body, validationResult } from 'express-validator'; // Import validation

const router = express.Router();

// @route   POST api/mentor/mentorship-requests
// @desc    Create a new mentorship request
// @access  Private (Project Creator/Collaborator)
router.post(
  '/mentorship-requests',
  protect,
  [
    body('mentor', 'Mentor ID is required').not().isEmpty(),
    body('message', 'Message is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mentor, message, project } = req.body;
    const requesterId = req.user.id;

    try {
      // Check if a pending request already exists from this requester to this mentor
      const existingRequest = await MentorRequest.findOne({
        requester: requesterId,
        mentor: mentor,
        status: 'pending',
      });

      if (existingRequest) {
        return res.status(400).json({ msg: 'You already have a pending mentorship request with this mentor.' });
      }

      const newRequest = new MentorRequest({
        requester: requesterId,
        mentor,
        project, // Optional
        message,
      });

      const savedRequest = await newRequest.save();

      // Create notification for the mentor
      const mentorUser = await User.findById(mentor);
      if (mentorUser) {
        const notificationMessage = `${req.user.name} has sent you a mentorship request.`;
        const newNotification = new Notification({
          user: mentor,
          message: notificationMessage,
          type: 'mentorship_request',
          relatedEntity: savedRequest._id, // Link to the request
          relatedEntityType: 'MentorRequest',
        });
        await newNotification.save();
      }

      res.json(savedRequest);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/mentor/mentorship-requests/sent
// @desc    Get all mentorship requests sent by the logged-in user
// @access  Private (Any authenticated user)
router.get('/mentorship-requests/sent', protect, async (req, res) => {
  try {
    const requesterId = req.user.id;
    const requests = await MentorRequest.find({ requester: requesterId })
      .populate('mentor', 'name email'); // Populate mentor details if needed

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   GET api/mentor/mentorship-requests
// @desc    Get all pending mentorship requests for the logged-in mentor
// @access  Private (Mentor only)
router.get('/mentorship-requests', protect, async (req, res) => {
  try {
    const mentorId = req.user.id;
    const requests = await MentorRequest.find({ mentor: mentorId, status: 'pending' })
      .populate('requester', 'name role') // Populate requester's name and role
      .populate('project', 'title'); // Populate project title if applicable

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/mentor/mentorship-requests/:id/status
// @desc    Update status of a mentorship request (accept/reject)
// @access  Private (Mentor only)
router.put('/mentorship-requests/:id/status', protect, async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body; // 'accepted' or 'rejected'
    const mentorId = req.user.id;

    let request = await MentorRequest.findById(requestId).populate('requester', 'name');

    if (!request) {
      return res.status(404).json({ msg: 'Mentorship request not found' });
    }

    // Ensure the request is for the logged-in mentor and is pending
    if (request.mentor.toString() !== mentorId || request.status !== 'pending') {
      return res.status(401).json({ msg: 'Not authorized or request already processed' });
    }

    request.status = status;
    await request.save();

    // Create notification for the requester
    const requesterUser = await User.findById(request.requester._id);
    if (requesterUser) {
      const notificationMessage = `Your mentorship request to ${request.mentor.name} has been ${status}.`;
      const newNotification = new Notification({
        user: request.requester._id,
        message: notificationMessage,
        type: 'mentorship_status_update',
        relatedEntity: request._id, // Link to the request
        relatedEntityType: 'MentorRequest',
      });
      await newNotification.save();
    }

    res.json({ msg: `Mentorship request ${status}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
