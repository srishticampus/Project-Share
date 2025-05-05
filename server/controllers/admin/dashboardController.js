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

// Function to get user growth data over time
export const getUserGrowthData = async (req, res) => {
  try {
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format the data for the frontend (e.g., [{ name: 'Jan 2023', users: 10 }])
    const formattedGrowthData = userGrowth.map(item => {
      const { year, month } = item._id;
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const name = `${monthNames[month - 1]} ${year}`;
      return { name, users: item.count };
    });

    res.status(200).json(formattedGrowthData);
  } catch (error) {
    console.error('Error fetching user growth data:', error);
    res.status(500).json({ message: 'Error fetching user growth data' });
  }
};

// Function to get user engagement data (placeholder)
export const getUserEngagementData = async (req, res) => {
  try {
    // TODO: Implement actual logic to fetch user engagement data (e.g., logins over time, active users)
    const dummyEngagementData = [
      { name: 'Jan', 'Active Users': 50 },
      { name: 'Feb', 'Active Users': 60 },
      { name: 'Mar', 'Active Users': 75 },
      { name: 'Apr', 'Active Users': 90 },
      { name: 'May', 'Active Users': 100 },
      { name: 'Jun', 'Active Users': 110 },
      { name: 'Jul', 'Active Users': 120 },
    ];

    res.status(200).json(dummyEngagementData);
  } catch (error) {
    console.error('Error fetching user engagement data:', error);
    res.status(500).json({ message: 'Error fetching user engagement data' });
  }
};

// Function to get project success rate data
export const getProjectSuccessRateData = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'Completed' });

    const successRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    // Return data in a format suitable for a chart (e.g., a single data point or over time if status history is tracked)
    // For simplicity, returning a single data point for now.
    const projectSuccessRateData = [{ name: 'Success Rate', value: successRate }];

    res.status(200).json(projectSuccessRateData);
  } catch (error) {
    console.error('Error fetching project success rate data:', error);
    res.status(500).json({ message: 'Error fetching project success rate data' });
  }
};

// Function to get popular categories data
export const getPopularCategoriesData = async (req, res) => {
  try {
    const popularCategories = await Project.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Format the data for the frontend (e.g., [{ name: 'Technology', projects: 15 }])
    const formattedCategoriesData = popularCategories.map(item => ({
      name: item._id,
      projects: item.count,
    }));

    res.status(200).json(formattedCategoriesData);
  } catch (error) {
    console.error('Error fetching popular categories data:', error);
    res.status(500).json({ message: 'Error fetching popular categories data' });
  }
};