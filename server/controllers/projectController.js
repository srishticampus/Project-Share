import express from 'express';
import Project from '../models/Project.js';
import Task from '../models/Task.js'; // Import the Task model
import User from '../models/user.js'; // Import the User model

const router = express.Router();

// GET /projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// GET /projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'name email bio portfolioLinks'); // Populate creator with username and email

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Increment projectInteractionCount for the user if authenticated
    if (req.user && req.user.id) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { projectInteractionCount: 1 } });
    }

    // Fetch tasks associated with the project
    const tasks = await Task.find({ project: req.params.id })
      .populate('createdBy', 'name email') // Populate creator of each task
      .populate('assignedTo', 'name email'); // Populate assignedTo user

    res.status(200).json({ project, tasks });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

export default router;
