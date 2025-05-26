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
import { getDashboardStats } from './dashboardController.js';
import { getUserGrowth, getUserEngagement, getProjectSuccessRate, getPopularCategories } from './analyticsController.js';
import { getUsers, createUser, getUserById, updateUser, deleteUser } from './userController.js';
import { getReports, removeReport, keepReport, markReportAsResolved } from './reportModerationController.js'; // Import report moderation functions
import mentorRequestRoutes from './mentorRequestController.js'; // Import mentor request routes
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
router.get('/analytics/user-growth', protect, admin, getUserGrowth);

// Get user engagement data for analytics
router.get('/analytics/user-engagement', protect, admin, getUserEngagement);

// Get project success rate data for analytics
router.get('/analytics/project-success-rate', protect, admin, getProjectSuccessRate);

// Get popular categories data for analytics
router.get('/analytics/popular-categories', protect, admin, getPopularCategories);

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

// Report Moderation Routes
router.get('/reports', protect, admin, getReports); // Get all reports
router.delete('/reports/:id', protect, admin, removeReport); // Remove a report
router.put('/reports/:id/keep', protect, admin, keepReport); // Keep a report with notes
router.put('/reports/:id/resolve', protect, admin, markReportAsResolved); // Mark a report as resolved

// Mentor Request Routes
router.use('/mentor-requests', protect, admin, mentorRequestRoutes); // Add mentor request routes

export default router;
