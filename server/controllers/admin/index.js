import express from 'express';
import {
  getAllProjects,
  updateProject,
  deleteProject,
} from './projectController.js';

// import {
//   getAllUsers,
//   updateUser,
//   deleteUser,
// } from './userController.js';

const router = express.Router();

// Get all projects
router.get('/projects', getAllProjects);

// Update a project
router.put('/projects/:id', updateProject);

// Delete a project
router.delete('/projects/:id', deleteProject);

// // Get all users
// router.get('/users', getAllUsers);

// // Update a user
// router.put('/users/:id', updateUser);

// // Delete a user
// router.delete('/users/:id', deleteUser);

export default router;