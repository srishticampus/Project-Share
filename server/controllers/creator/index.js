import express from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject } from './projectController';
import { createTask, assignTask, updateTask, getTasksByProject, deleteTask, editTask } from './taskController';
import { getApplicationsForCreatorProjects } from '../applicationController.js';

const router = express.Router();

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

export default router;