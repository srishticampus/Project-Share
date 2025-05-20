import express from 'express';
import authRoutes from './auth/index.js';
import creatorRoutes from './creator/index.js';
import adminRoutes from './admin/index.js';
import projectRoutes from './projectController.js'; // Import the new project routes
import collaboratorRoutes from './collaborator/collaboratorController.js'; // Import collaborator routes
import { protect } from '../middleware/auth.js';
import messageRoutes from './messageController.js';
import { createApplication, updateApplicationStatus } from './applicationController.js';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Creator routes with authentication
router.use('/creator', protect, creatorRoutes);

// Admin routes with authentication
router.use('/admin', protect, adminRoutes);

// Collaborator routes with authentication
router.use('/collaborator', protect, collaboratorRoutes);

// Project routes
router.use('/projects', projectRoutes); // Use the new project routes


// Message routes
router.use('/messages', messageRoutes);

// Application routes
router.post('/applications', protect, createApplication); // Protected route for creating applications
router.put('/applications/:id/status', protect, updateApplicationStatus); // Protected route for updating application status

export default router;