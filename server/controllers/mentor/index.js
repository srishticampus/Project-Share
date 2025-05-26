import express from 'express';
import dashboardRoutes from './dashboardController.js';
import mentorRequestRoutes from './mentorRequestController.js';
import activeMentorshipRoutes from './activeMentorshipController.js';
import mentorProjectRoutes from './projectController.js';
import articleRoutes from './articleController.js'; // Import article routes
import chatRoutes from './chatController.js'; // Import chat routes

const router = express.Router();

// Dashboard routes
router.use('/', dashboardRoutes);
// Mentorship request routes
router.use('/', mentorRequestRoutes);
// Active mentorship routes
router.use('/', activeMentorshipRoutes);
// Mentor project routes (browse, follow, feedback)
router.use('/', mentorProjectRoutes);
// Article routes (create, view, edit, delete)
router.use('/', articleRoutes); // Add article routes
// Chat routes (for mentees)
router.use('/', chatRoutes); // Add chat routes

export default router;
