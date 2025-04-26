import express from 'express';
import {
  getAllProjects,
  updateProject,
  deleteProject,
} from './projectController.js';
import { getDashboardStats } from './dashboardController.js';
import { getUsers, createUser, getUserById, updateUser, deleteUser } from './userController.js';
import { protect, admin } from "../../middleware/auth.js";

const router = express.Router();

// Get all projects
router.get('/projects', protect, admin, getAllProjects);

// Update a project
router.put('/projects/:id', protect, admin, updateProject);

// Delete a project
router.delete('/projects/:id', protect, admin, deleteProject);

// Get dashboard statistics
router.get('/dashboard', protect, admin, getDashboardStats);

// Get all users
router.get('/users', protect, admin, getUsers);

// Create a new user
router.post('/users', protect, admin, createUser);

// Get user by ID
router.get('/users/:id', protect, admin, getUserById);

// Update a user
router.put('/users/:id', protect, admin, updateUser);

// Delete a user
router.delete('/users/:id', protect, admin, deleteUser);

export default router;