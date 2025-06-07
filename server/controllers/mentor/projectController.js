import express from 'express';
import { protect } from '../../middleware/auth.js';
import Project from '../../models/Project.js';
import User from '../../models/user.js';
import NotificationService from '../../services/notificationService.js'; // Import NotificationService

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
      // Create notification for the project creator using the service
      await NotificationService.createNotification(
        project.creator,
        'project_feedback',
        project._id,
        'Project'
      );
    }

    res.json({ msg: 'Feedback provided successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   GET api/mentor/dashboard/recent-projects
// @desc    Get recent projects for the current mentor (followed or provided feedback on)
// @access  Private (Mentor only)
router.get('/dashboard/recent-projects', protect, async (req, res) => {
  try {
    const mentorId = req.user.id;

    // Find projects the mentor is following
    const user = await User.findById(mentorId).select('followedProjects');
    const followedProjectIds = user ? user.followedProjects : [];

    // Find projects where the mentor has provided feedback
    const projectsWithFeedback = await Project.find({ 'feedback.mentor': mentorId })
      .select('title description status updatedAt');

    // Combine followed projects and projects with feedback, then deduplicate
    const combinedProjectsMap = new Map();

    if (followedProjectIds.length > 0) {
      const followedProjects = await Project.find({ _id: { $in: followedProjectIds } })
        .select('title description status updatedAt');
      followedProjects.forEach(project => {
        combinedProjectsMap.set(project._id.toString(), project.toObject());
      });
    }

    projectsWithFeedback.forEach(project => {
      combinedProjectsMap.set(project._id.toString(), project.toObject());
    });

    // Convert map values to an array and sort by updatedAt
    const recentProjects = Array.from(combinedProjectsMap.values())
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5); // Limit to 5 recent projects

    res.status(200).json({
      success: true,
      data: recentProjects
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
