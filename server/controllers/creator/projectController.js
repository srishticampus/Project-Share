import Project from '../../models/Project';

// Helper function to validate tech stack
const validateTechStack = (techStack,res) => {
  if (!Array.isArray(techStack)) {
    return false;
  }
  return techStack.map(tech => tech.trim()).filter(tech => tech);
};

export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, status } = req.body;
    let techstack = validateTechStack(techStack,res);
    if(!techstack){
      return res.status(400).json({ success: false, error: 'Tech stack must be an array' });
    }
    const project = new Project({
      title,
      description,
      techStack: techstack,
      status,
      creator: req.user._id
    });

    await project.save();
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
    const allowedUpdates = ['title', 'description', 'techStack', 'status'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ success: false, error: 'Invalid updates!' });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      { 
        ...req.body,
        techStack: validateTechStack(req.body.techStack)
      },
      { new: true, runValidators: true }
    );

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