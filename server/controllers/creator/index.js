import express from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject } from './projectController';

const router = express.Router();

router.post('/projects', createProject);
router.get('/projects', getProjects);
router.get('/projects/:id', getProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

export default router;