import Project from '../../models/Project.js';

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('creator', 'name') // Populate creator and select only the name
      .populate('collaborators', 'name'); // Populate collaborators and select only the name
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentAdminProjects = async (req, res) => {
  try {
    const recentProjects = await Project.find()
      .sort({ updatedAt: -1 }) // Sort by most recently updated
      .limit(5) // Limit to, for example, 5 recent projects
      .select('title description status creator'); // Select relevant fields

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
