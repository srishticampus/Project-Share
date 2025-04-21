import express from 'express';
import authRoutes from './auth/index.js';
import creatorRoutes from './creator/index.js';
import adminRoutes from './admin/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Creator routes with authentication
router.use('/creator', protect, creatorRoutes);

// Admin routes with authentication
router.use('/admin', protect, adminRoutes);

export default router;