import express from 'express';
import { protect } from '../../middleware/auth.js';
import Project from '../../models/Project.js';
import User from '../../models/user.js';
import Notification from '../../models/Notification.js'; // Import Notification model

const router = express.Router();

// @route   GET api/mentor/browse-projects
// @desc    Get all projects with search and filter for mentors
// @access  Private (Mentor only)
router.get('/browse-projects', protect, async (req, res) => {
  try {
    const { search, category, skill } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (skill) {
      query.requiredSkills = { $in: [skill] };
    }

    const projects = await Project.find(query).populate('creator', 'name'); // Populate creator's name

    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/mentor/projects/:id/follow
// @desc    Allow a mentor to follow a project
// @access  Private (Mentor only)
router.post('/projects/:id/follow', protect, async (req, res) => {
  try {
    const projectId = req.params.id;
    const mentorId = req.user.id;

    const user = await User.findById(mentorId);
    if (!user) {
      return res.status(404).json({ msg: 'Mentor not found' });
    }

    // Check if already following
    if (user.followedProjects.includes(projectId)) {
      return res.status(400).json({ msg: 'Already following this project' });
    }

    user.followedProjects.push(projectId);
    await user.save();

    res.json({ msg: 'Project followed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/mentor/projects/:id/feedback
// @desc    Allow a mentor to provide feedback on a followed project
// @access  Private (Mentor only)
router.post('/projects/:id/feedback', protect, async (req, res) => {
  try {
    const projectId = req.params.id;
    const mentorId = req.user.id;
    const { feedbackMessage } = req.body;

    // Check if the mentor is following this project
    const user = await User.findById(mentorId);
    if (!user || !user.followedProjects.includes(projectId)) {
      return res.status(401).json({ msg: 'Not authorized to provide feedback on this project (not following)' });
    }

    // Find the project and add feedback
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Assuming Project model has a 'feedback' array or similar
    // This part needs to be implemented in the Project model if not already.
    // For now, let's assume a simple structure.
    const newFeedback = {
      mentor: mentorId,
      message: feedbackMessage,
      date: new Date(),
    };

    if (!project.feedback) {
      project.feedback = [];
    }
    project.feedback.push(newFeedback);
    await project.save();

    // Create notification for the project creator
    const projectCreator = await User.findById(project.creator);
    if (projectCreator) {
      const mentorUser = await User.findById(mentorId);
      const notificationMessage = `${mentorUser.name} has provided feedback on your project "${project.title}".`;
      const newNotification = new Notification({
        user: project.creator,
        message: notificationMessage,
        type: 'project_feedback',
        relatedEntity: project._id, // Link to the project
        relatedEntityType: 'Project',
      });
      await newNotification.save();
    }

    res.json({ msg: 'Feedback provided successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


export default router;
