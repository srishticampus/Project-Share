import express from 'express';
import authRoutes from './auth/index.js';
import creatorRoutes from './creator/index.js';
import adminRoutes from './admin/index.js';
import projectRoutes from './projectController.js'; // Import the new project routes
import collaboratorRoutes from './collaborator/collaboratorController.js'; // Import collaborator routes
import mentorRoutes from './mentor/index.js'; // Import mentor routes
import userController from './userController.js'; // Import user controller
import { protect } from '../middleware/auth.js';
import messageRoutes from './messageController.js';
import { createApplication, updateApplicationStatus } from './applicationController.js';
import { submitReport } from './reportController.js';
import contactFormController from './contactFormController.js'; // Import the new contact form controller
import { getRecommendedProjectsForCollaborator, getRecommendedMentorsForUser, getRecommendedProjectsForMentor } from './recommendationController.js';
import { generateTask, chatWithAI } from './geminiController.js'; // Import the new gemini controller

const router = express.Router();

//Test route
router.get('/',(req,res)=>{
    res.send("Api is working fine")
})
// Auth routes
router.use('/auth', authRoutes);

// Gemini routes
router.post('/gemini/generate-task', protect, generateTask);
router.post('/gemini/chat', protect, chatWithAI);

// Creator routes with authentication
router.use('/creator', protect, creatorRoutes);

// Admin routes with authentication
router.use('/admin', protect, adminRoutes);

// Collaborator routes with authentication
router.use('/collaborator', protect, collaboratorRoutes);

// Mentor routes with authentication
router.use('/mentor', protect, mentorRoutes); // Use mentor routes

// User routes (e.g., for fetching lists of users by role)
router.use('/users', protect, userController); // Add user controller routes

// Project routes
router.use('/projects', projectRoutes); // Use the new project routes


// Message routes
router.use('/messages', messageRoutes);

// Report routes
router.post('/reports', protect, submitReport); // Protected route for submitting reports

// Contact Form routes
router.use('/contact', contactFormController); // Use the new contact form routes

// Recommendation routes
router.get('/recommendations/projects', protect, getRecommendedProjectsForCollaborator);
router.get('/recommendations/mentors', protect, getRecommendedMentorsForUser);
router.get('/recommendations/mentor-projects', protect, getRecommendedProjectsForMentor);

// Application routes
router.post('/applications', protect, createApplication); // Protected route for creating applications
router.put('/applications/:id/status', protect, updateApplicationStatus); // Protected route for updating application status

export default router;
