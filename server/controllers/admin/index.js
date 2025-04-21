import express from 'express';
import {
  getAllProjects,
  updateProject,
  deleteProject,
} from './projectController.js';

const router = express.Router();

// Get all projects
router.get('/projects', getAllProjects);

// Update a project
router.put('/projects/:id', updateProject);

// Delete a project
router.delete('/projects/:id', deleteProject);

export default router;