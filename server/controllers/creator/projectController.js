import Project from '../../models/Project.js';
import User from '../../models/user.js'; // Import the User model
import Task from '../../models/Task.js'; // Import the Task model

// Helper function to validate tech stack
const validateTechStack = (techStack,res) => {
  if (!Array.isArray(techStack)) {
    return false;
  }
  return techStack.map(tech => tech.trim()).filter(tech => tech);
};

export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, status, category } = req.body;
    let techstack = validateTechStack(techStack,res);
    if(!techstack){
      return res.status(400).json({ success: false, error: 'Tech stack must be an array' });
    }
    const project = new Project({
      title,
      description,
      category, // Added category
      techStack: techstack,
      status,
      creator: req.user._id
    });

    await project.save();

    // Increment projectInteractionCount for the creator
    await User.findByIdAndUpdate(req.user._id, { $inc: { projectInteractionCount: 1 } });

    res.status(201).json({
      success: true,
      data: await project.populate('creator', 'name email')
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ creator: req.user._id })
      .populate('creator', 'name email')
      .populate('collaborators', 'name role');
      
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      creator: req.user._id
    }).populate('creator collaborators', 'name email role');

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'techStack', 'status', 'category']; // Added category
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ success: false, error: 'Invalid updates!' });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      { 
        ...req.body,
        techStack: validateTechStack(req.body.techStack),
        category: req.body.category // Added category
      },
      { new: true, runValidators: true }
    ).populate('creator', 'name email')
    .populate('collaborators', 'name role');

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      creator: req.user._id
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getProjectDashboardStats = async (req, res) => {
  try {
    const creatorId = req.user._id;

    const totalProjects = await Project.countDocuments({ creator: creatorId });
    const activeProjects = await Project.countDocuments({ creator: creatorId, status: 'In Progress' });
    const completedProjects = await Project.countDocuments({ creator: creatorId, status: 'Completed' });

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        completedProjects,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

export const getRecentCreatorProjects = async (req, res) => {
  try {
    const creatorId = req.user._id;
    const recentProjects = await Project.find({ creator: creatorId })
      .sort({ updatedAt: -1 }) // Sort by most recently updated
      .limit(5) // Limit to, for example, 5 recent projects
      .populate('creator', 'name email')
      .select('title description status'); // Select relevant fields

    res.status(200).json({
      success: true,
      data: recentProjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

export const getProjectProgress = async (req, res) => {
  try {
    const creatorId = req.user._id;

    // Find all projects created by the current creator
    const projects = await Project.find({ creator: creatorId }).select('_id title');

    const projectProgressData = [];

    for (const project of projects) {
      const totalTasks = await Task.countDocuments({ project: project._id });
      const completedTasks = await Task.countDocuments({ project: project._id, status: 'Completed' });

      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      projectProgressData.push({
        name: project.title, // Use project title as the name for the chart
        progress: parseFloat(progress.toFixed(2)), // Format to 2 decimal places
      });
    }

    res.status(200).json({
      success: true,
      data: projectProgressData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message,
    });
  }
};
