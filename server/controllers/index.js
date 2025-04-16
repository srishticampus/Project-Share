import express from 'express';
import authRoutes from './auth/index.js';
// Import other controller routes here as they are created
// import projectRoutes from './projects/index.js';
// import userRoutes from './users/index.js';

const router = express.Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Mount other routes here
// router.use('/projects', projectRoutes);
// router.use('/users', userRoutes);

// Default route for API status check (optional)
router.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

export default router;