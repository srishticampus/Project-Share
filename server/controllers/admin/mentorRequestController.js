import express from 'express';
import { protect } from '../../middleware/auth.js';
import MentorRequest from '../../models/MentorRequest.js';
import User from '../../models/user.js'; // To populate user details

const router = express.Router();

// @route   GET api/admin/mentor-requests
// @desc    Get all pending mentor requests for admin review
// @access  Private (Admin only)
router.get('/', protect, async (req, res) => {
  try {
    // Ensure only admin can access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const requests = await MentorRequest.find({ status: 'pending' })
      .populate('requester', 'name email photo contactNumber skills yearsOfExperience') // Populate relevant user details for the requester, using 'skills'
      .populate('mentor', 'name email photo contactNumber areasOfExpertise yearsOfExperience'); // Populate relevant user details for the mentor

    res.json(requests);
  } catch (err) {
    console.error("Error fetching mentor requests:", err);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/admin/mentor-requests/:id/status
// @desc    Update status of a mentor request (approve/reject) and update user role if approved
// @access  Private (Admin only)
router.put('/:id/status', protect, async (req, res) => {
  try {
    // Ensure only admin can access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const requestId = req.params.id;
    const { status } = req.body; // 'accepted' or 'rejected'

    let request = await MentorRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ msg: 'Mentor request not found' });
    }

    // Only allow status update if current status is pending
    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Request already processed' });
    }

    request.status = status;
    await request.save();

    // If approved, update the requester's role to 'mentor'
    if (status === 'accepted') {
      const user = await User.findById(request.requester);
      if (user) {
        user.role = 'mentor';
        user.isVerified = true; // Optionally set to verified upon approval
        await user.save();
      }
    }

    res.json({ msg: `Mentor request ${status} and user role updated if accepted` });
  } catch (err) {
    console.error(`Error updating mentor request status:`, err);
    res.status(500).send('Server error');
  }
});

export default router;
