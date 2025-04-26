// server/controllers/admin/dashboardController.js
import mongoose from 'mongoose';
import User from '../../models/user.js';
import Project from '../../models/Project.js';
import Report from '../../models/Report.js';

// Function to get the total count of users with a specific role
const getTotalUsersByRole = async (role) => {
  try {
    const count = await User.countDocuments({ role });
    return count;
  } catch (error) {
    console.error(`Error getting total ${role} count:`, error);
    throw error;
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts for different user roles
    const totalProjectCreators = await getTotalUsersByRole('creator');
    const totalCollaborators = await getTotalUsersByRole('collaborator');
    const totalMentors = await getTotalUsersByRole('mentor');

    // Get recent projects (e.g., last 5 projects)
    const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5);

    // Get recent reports (e.g., last 3 reports)
    const recentReports = await Report.find().sort({ createdAt: -1 }).limit(3);

    // Prepare the response data
    const dashboardData = {
      totalProjectCreators,
      totalCollaborators,
      totalMentors,
      recentProjects,
      recentReports,
    };

    // Send the response
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error getting dashboard statistics:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};