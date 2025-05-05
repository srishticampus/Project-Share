import express from 'express';
import {
  getAllProjects,
  updateProject,
  deleteProject,
} from './projectController.js';
import {
  getAllProjects,
  updateProject,
  deleteProject,
} from './projectController.js';
import { getDashboardStats, getUserGrowthData, getUserEngagementData, getProjectSuccessRateData, getPopularCategoriesData } from './dashboardController.js';
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

// Get user growth data for analytics
router.get('/analytics/user-growth', protect, admin, getUserGrowthData);

// Get user engagement data for analytics
router.get('/analytics/user-engagement', protect, admin, getUserEngagementData);

// Get project success rate data for analytics
router.get('/analytics/project-success-rate', protect, admin, getProjectSuccessRateData);

// Get popular categories data for analytics
router.get('/analytics/popular-categories', protect, admin, getPopularCategoriesData);

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