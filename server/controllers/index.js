import express from 'express';
import authRoutes from './auth/index.js';
import creatorRoutes from './creator/index.js';
import adminRoutes from './admin/index.js';
import projectRoutes from './projectController.js'; // Import the new project routes
import { protect } from '../middleware/auth.js';
import {createMessage,deleteMessage,getMessages} from './messageController.js';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Creator routes with authentication
router.use('/creator', protect, creatorRoutes);

// Admin routes with authentication
router.use('/admin', protect, adminRoutes);

// Project routes
router.use('/projects', projectRoutes); // Use the new project routes


// Message routes
router.post('/messages', createMessage);
router.get('/messages', getMessages);
router.delete('/messages/:id', deleteMessage);
export default router;