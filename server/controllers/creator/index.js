import express from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject, getProjectDashboardStats, getRecentCreatorProjects } from './projectController.js';
import { createTask, assignTask, updateTask, getTasksByProject, deleteTask, editTask } from './taskController.js';
import { getApplicationsForCreatorProjects, getApplicationDashboardStats } from '../applicationController.js';
import creatorProfileRoutes from './profileController.js'; // Import creator profile routes

const router = express.Router();

router.use('/', creatorProfileRoutes); // Add creator profile routes

router.post('/projects', createProject);
router.get('/projects', getProjects);
router.get('/projects/:id', getProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Task routes
router.post('/tasks', createTask);
router.post('/tasks/assign', assignTask);
router.put('/tasks/:taskId', updateTask);
router.get('/projects/:projectId/tasks', getTasksByProject);
router.delete('/tasks/:taskId', deleteTask);
router.put('/tasks/:taskId/edit', editTask);

// Application routes for creator
router.get('/applications', getApplicationsForCreatorProjects);

// Dashboard stats routes for creator
router.get('/dashboard/project-stats', getProjectDashboardStats);
router.get('/dashboard/application-stats', getApplicationDashboardStats);
router.get('/dashboard/recent-projects', getRecentCreatorProjects);

export default router;
