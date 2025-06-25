// server/controllers/admin/analyticsController.js
import User from '../../models/user.js';
import Project from '../../models/Project.js';
import mongoose from 'mongoose';

// Function to get user growth data over time
export const getUserGrowth = async (req, res) => {
  try {
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $ne: null } // Filter out documents where createdAt is null
        }
      },
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

    console.log('User Growth Aggregation Result:', userGrowth);
    console.log('Formatted User Growth Data:', formattedGrowthData);

    res.status(200).json(formattedGrowthData);
  } catch (error) {
    console.error('Error fetching user growth data:', error);
    res.status(500).json({ message: 'Error fetching user growth data' });
  }
};

// Function to get user engagement data (placeholder - needs actual implementation)
export const getUserEngagement = async (req, res) => {
  try {
    const userEngagement = await User.aggregate([
      {
        $match: {
          createdAt: { $ne: null } // Filter out documents where createdAt is null
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalLogins: { $sum: "$loginCount" },
          totalProjectInteractions: { $sum: "$projectInteractionCount" },
          totalTaskInteractions: { $sum: "$taskInteractionCount" },
          totalChatActivity: { $sum: "$chatActivityCount" },
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format the data for the frontend
    const formattedEngagementData = userEngagement.map(item => {
      const { year, month } = item._id;
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const name = `${monthNames[month - 1]} ${year}`;
      return {
        name,
        'Logins': item.totalLogins,
        'Project Interactions': item.totalProjectInteractions,
        'Task Interactions': item.totalTaskInteractions,
        'Chat Activity': item.totalChatActivity,
      };
    });

    res.status(200).json(formattedEngagementData);
  } catch (error) {
    console.error('Error fetching user engagement data:', error);
    res.status(500).json({ message: 'Error fetching user engagement data' });
  }
};

// Function to get project success rate data
export const getProjectSuccessRate = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'Completed' });

    const successRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    // Return data in a format suitable for a chart
    const projectSuccessRateData = [{ name: 'Success Rate', value: successRate }];

    res.status(200).json({ successRateData: projectSuccessRateData, totalProjects, completedProjects });
  } catch (error) {
    console.error('Error fetching project success rate data:', error);
    res.status(500).json({ message: 'Error fetching project success rate data' });
  }
};

// Function to get popular categories data
export const getPopularCategories = async (req, res) => {
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
