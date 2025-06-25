import express from 'express';
import mongoose from 'mongoose'; // Import mongoose
import multer from 'multer';
import path from 'path';
import { protect } from '../../middleware/auth.js'; // Import protect middleware
import User from '../../models/user.js'; // Assuming User model is needed
import Project from '../../models/Project.js'; // Assuming Project model is needed
import Application from '../../models/Application.js'; // Assuming Application model is needed
import Task from '../../models/Task.js'; // Assuming Task model is needed
import MentorRequest from '../../models/MentorRequest.js'; // Assuming MentorRequest model is needed

const router = express.Router();

// @route   GET /api/collaborator/profile/:id
// @desc    Get collaborator profile by ID
// @access  Public (or protected if needed, but for public profiles, it should be accessible)
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid collaborator ID' });
    }

    const collaborator = await User.findOne({ _id: id, role: 'collaborator' }).select('-password');

    if (!collaborator) {
      return res.status(404).json({ message: 'Collaborator not found' });
    }

    res.status(200).json(collaborator);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collaborator/portfolio/:id
// @desc    Get collaborator portfolio by ID
// @access  Public
router.get('/portfolio/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid collaborator ID' });
    }

    const user = await User.findOne({ _id: id, role: 'collaborator' })
      .select('skills portfolioLinks bio portfolioProjects')
      .populate({
        path: 'portfolioProjects',
        select: 'title contributions',
        populate: {
          path: 'contributions.collaborator',
          select: 'name',
        }
      });

    if (!user) {
      return res.status(404).json({ msg: 'Collaborator portfolio not found' });
    }

    const projectsWithMyContributions = user.portfolioProjects.map(project => {
      const projectObject = project.toObject();
      const collaboratorContribution = projectObject.contributions.find(
        (c) => c.collaborator && c.collaborator._id.toString() === id
      );
      return {
        ...projectObject,
        myContributions: collaboratorContribution ? collaboratorContribution.text : '',
      };
    });

    const portfolio = {
      skillsShowcase: user.skills,
      portfolioLinks: user.portfolioLinks,
      bio: user.bio,
      projects: projectsWithMyContributions,
    };

    res.status(200).json(portfolio);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Protect all collaborator routes
router.use(protect);

// @route   GET /api/collaborator/dashboard/counts
// @desc    Get collaborator dashboard counts
// @access  Private
router.get('/dashboard/counts', async (req, res) => {
  try {
    const userId = req.user._id;

    // Count applied projects
    const appliedProjectsCount = await Application.countDocuments({ applicantId: userId });

    // Count active projects (where user is a collaborator and project status is Active)
    const activeProjectsCount = await Project.countDocuments({
      collaborators: userId,
      status: 'Active',
    });

    // Count completed projects (where user is a collaborator and project status is Completed)
    const completedProjectsCount = await Project.countDocuments({
      collaborators: userId,
      status: 'Completed',
    });

    res.json({
      appliedProjectsCount,
      activeProjectsCount,
      completedProjectsCount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collaborator/projects
// @desc    Get all projects (with optional search and filters)
// @access  Private
router.get('/projects', async (req, res) => {
  try {
    const { searchTerm, category, skills } = req.query;
    const filter = {};

    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (skills) {
      // Assuming skills are stored as an array in the Project model
      filter.skills = { $in: skills.split(',') };
    }

    const projects = await Project.find(filter).populate('creator', 'name'); // Populate creator name

    const projectsWithStatus = await Promise.all(projects.map(async (project) => {
      const projectObject = project.toObject();
      let collaboratorStatus = null;

      // Check if the current user is an active collaborator on the project
      if (project.collaborators.includes(req.user.id) && project.status === 'In Progress') {
        collaboratorStatus = 'Active';
      } else {
        // Check if the current user has applied to this project
        const application = await Application.findOne({
          projectId: project._id,
          applicantId: req.user.id,
          status: { $in: ['Pending', 'Accepted'] }
        });
        if (application) {
          collaboratorStatus = 'Applied';
        }
      }

      return {
        ...projectObject,
        collaboratorStatus,
      };
    }));

    res.json(projectsWithStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collaborator/projects/:projectId
// @desc    Get details of a specific project
// @access  Private
router.get('/projects/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId)
      .populate('creator', 'name') // Populate creator name
      .populate('collaborators', 'name'); // Populate collaborator names

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Increment projectInteractionCount for the collaborator
    await User.findByIdAndUpdate(req.user.id, { $inc: { projectInteractionCount: 1 } });

    res.json(project);
  } catch (err) {
    console.error(err.message);
    // Check if the error is due to an invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not error' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/collaborator/projects/:projectId/apply
// @desc    Apply to a project
// @access  Private
router.post('/projects/:projectId/apply', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { message } = req.body;
    const userId = req.user.id;

    // Check if the user has already applied to this project
    const existingApplication = await Application.findOne({
      project: projectId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied to this project' });
    }

    // Create a new application
    const application = new Application({
      project: projectId,
      applicant: userId,
      message,
      status: 'Pending', // Default status
    });

    await application.save();

    // Increment projectInteractionCount for the collaborator
    await User.findByIdAndUpdate(userId, { $inc: { projectInteractionCount: 1 } });

    res.status(201).json({ msg: 'Application submitted successfully', application });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collaborator/my-projects/applied
// @desc    Get applied projects for the current collaborator
// @access  Private
router.get('/my-projects/applied', async (req, res) => {
  try {
    const userId = req.user._id;
    // Find applications by the current user and populate project details
    const applications = await Application.find({ applicantId: userId }).populate({
      path: 'projectId',
      select: 'title creator category',
      populate: {
        path: 'creator',
        select: 'name',
      },
    });

    // Filter out applications where projectId is null (i.e., project was not found or deleted)
    const validApplications = applications.filter(app => app.projectId !== null);

    // Transform the result for valid applications
    const appliedProjects = validApplications.map(app => {
      return {
        _id: app.projectId._id,
        projectTitle: app.projectId.title,
        creator: app.projectId.creator,
        category: app.projectId.category,
        status: app.status,
        applicationDate: app.createdAt,
      }
    });

    res.json(appliedProjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collaborator/my-projects/active
// @desc    Get active projects for the current collaborator
// @access  Private
router.get('/my-projects/active', async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching active projects for user:', userId);

    // Find active projects where the current user is a collaborator
    const activeProjects = await Project.find({
      collaborators: userId,
      status: 'In Progress',
    }).populate('creator', 'name'); // Populate creator name

    console.log('Found active projects:', activeProjects);

    // For each active project, find tasks assigned to the current user
    const projectsWithTasks = await Promise.all(activeProjects.map(async project => {
      const tasks = await Task.find({
        project: project._id,
        assignedTo: userId,
      });
      return {
        ...project.toObject(), // Convert Mongoose document to plain object
        myTasks: tasks,
      };
    }));

    console.log('Projects with tasks:', projectsWithTasks);

    res.json(projectsWithTasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collaborator/my-projects/completed
// @desc    Get completed projects for the current collaborator
// @access  Private
router.get('/my-projects/completed', async (req, res) => {
  try {
    const userId = req.user.id;

    // Find completed projects where the current user is a collaborator
    const completedProjects = await Project.find({
      collaborators: userId,
      status: 'Completed',
    }).populate('creator', 'name').populate('category').populate('contributions.collaborator', 'name');

    // Fetch the current user's portfolio projects
    const user = await User.findById(userId).select('portfolioProjects');
    const userPortfolioProjectIds = user ? user.portfolioProjects.map(p => p.toString()) : [];

    // Add a flag to each project indicating if it's in the user's portfolio
    // And also add the specific contribution of the current collaborator
    const projectsWithCollaboratorContributions = completedProjects.map(project => {
      const projectObject = project.toObject();
      const collaboratorContribution = projectObject.contributions.find(
        (c) => c.collaborator && c.collaborator._id.toString() === userId
      );

      return {
        ...projectObject,
        myContributions: collaboratorContribution ? collaboratorContribution.text : '',
        addToPortfolio: userPortfolioProjectIds.includes(project._id.toString()),
      };
    });

    res.json(projectsWithCollaboratorContributions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/collaborator/projects/:projectId/tasks/:taskId
// @desc    Update task status within an active project
// @access  Private
router.put('/projects/:projectId/tasks/:taskId', async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Find the task by ID, project ID, and assigned user to ensure ownership
    const task = await Task.findOne({
      _id: taskId,
      project: projectId,
      assignedTo: userId,
    });

    if (!task) {
      return res.status(404).json({ msg: 'Task not found or not assigned to you in this project' });
    }

    // Update the task status
    task.status = status;
    await task.save();

    res.json({ msg: 'Task status updated successfully', task });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collaborator/portfolio
// @desc    Get the current collaborator's portfolio data
// @access  Private
router.get('/portfolio', async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user profile data and populate portfolioProjects
    const user = await User.findById(userId)
      .select('skills portfolioLinks bio portfolioProjects')
      .populate({
        path: 'portfolioProjects',
        select: 'title contributions', // Populate title and contributions
        populate: {
          path: 'contributions.collaborator', // Populate the collaborator within contributions
          select: 'name',
        }
      });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Add myContributions to each project in the portfolio
    const projectsWithMyContributions = user.portfolioProjects.map(project => {
      const projectObject = project.toObject();
      const collaboratorContribution = projectObject.contributions.find(
        (c) => c.collaborator && c.collaborator._id.toString() === userId
      );
      return {
        ...projectObject,
        myContributions: collaboratorContribution ? collaboratorContribution.text : '',
      };
    });

    const portfolio = {
      skillsShowcase: user.skills,
      portfolioLinks: user.portfolioLinks,
      bio: user.bio,
      projects: projectsWithMyContributions, // Use the projects with contributions
    };

    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/collaborator/portfolio
// @desc    Update the current collaborator's portfolio data
// @access  Private
router.put('/portfolio', async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillsShowcase, portfolioLinks, bio } = req.body;

    // Find the user and update their portfolio fields
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.skills = skillsShowcase;
    user.portfolioLinks = portfolioLinks;
    user.bio = bio;

    await user.save();

    res.json({ msg: 'Portfolio updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/collaborator/my-projects/completed/:projectId/toggle-portfolio
// @desc    Toggle add to portfolio status for a completed project
// @access  Private
router.put('/my-projects/completed/:projectId/toggle-portfolio', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { addToPortfolio } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    if (addToPortfolio) {
      // Add project to portfolioProjects if not already present
      user.portfolioProjects.addToSet(projectId);
    } else {
      // Remove project from portfolioProjects
      user.portfolioProjects.pull(projectId);
    }

    await user.save();

    res.json({ msg: 'Project portfolio status updated successfully for user.', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collaborator/chat/creators
// @desc    Get a list of project creators the collaborator can chat with
// @access  Private
router.get('/chat/creators', async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Collaborator User ID:', userId); // Log user ID
    const { searchTerm } = req.query;

    // Find projects the user has applied to or is a collaborator on
    const appliedProjectIds = await Application.distinct('project', { applicant: userId });
    console.log('Applied Project IDs:', appliedProjectIds); // Log applied project IDs

    const projects = await Project.find({
      $or: [
        { collaborators: userId },
        { _id: { $in: appliedProjectIds } },
      ],
    }).populate('creator', 'name'); // Populate creator details
    console.log('Projects found for chat:', projects); // Log found projects

    // Extract unique creator IDs and their associated project titles
    const creatorsMap = new Map();
    projects.forEach(project => {
      if (project.creator && !creatorsMap.has(project.creator._id.toString())) {
        creatorsMap.set(project.creator._id.toString(), {
          _id: project.creator._id,
          name: project.creator.name,
          projects: [project.title], // Store project titles
        });
      } else if (project.creator) {
        creatorsMap.get(project.creator._id.toString()).projects.push(project.title);
      }
    });

    let creators = Array.from(creatorsMap.values());

    // Implement search filtering
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      creators = creators.filter(creator =>
        searchRegex.test(creator.name) || creator.projects.some(projectTitle => searchRegex.test(projectTitle))
      );
    }

    res.json(creators);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collaborator/mentors
// @desc    Get a list of mentors
// @access  Private
router.get('/mentors', async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const filter = { role: 'mentor' };

    if (searchTerm) {
      filter.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { expertise: { $regex: searchTerm, $options: 'i' } }, // Assuming expertise is a string or array of strings
        { bio: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const mentors = await User.find(filter).select('-password'); // Exclude password

    res.json(mentors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/collaborator/mentors/:mentorId/request-mentorship
// @desc    Request mentorship from a specific mentor
// @access  Private
router.post('/mentors/:mentorId/request-mentorship', async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    const { message } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if the mentor exists and is actually a mentor
    const mentor = await User.findOne({ _id: mentorId, role: 'mentor' });

    if (!mentor) {
      return res.status(404).json({ msg: 'Mentor not found' });
    }

    // Create a new mentorship request
    const mentorRequest = new MentorRequest({
      mentor: mentorId,
      requester: userId,
      requesterRole: userRole,
      message,
      status: 'Pending', // Default status
    });

    await mentorRequest.save();

    res.status(201).json({ msg: 'Mentorship request submitted successfully', mentorRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collaborator/dashboard/recent-projects
// @desc    Get recent projects for the current collaborator (applied, active, completed)
// @access  Private
router.get('/dashboard/recent-projects', async (req, res) => {
  try {
    const userId = req.user.id;

    // Find projects where the user is a collaborator
    const projectsAsCollaborator = await Project.find({ collaborators: userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title description status');

    // Find projects the user has applied to
    const appliedProjects = await Application.find({ applicant: userId })
      .populate({
        path: 'project',
        select: 'title description status updatedAt',
      })
      .sort({ 'project.updatedAt': -1 }) // Sort by project's updatedAt
      .limit(5);

    // Combine and deduplicate projects
    const combinedProjectsMap = new Map();

    projectsAsCollaborator.forEach(project => {
      combinedProjectsMap.set(project._id.toString(), project.toObject());
    });

    appliedProjects.forEach(app => {
      if (app.project) {
        combinedProjectsMap.set(app.project._id.toString(), app.project.toObject());
      }
    });

    // Convert map values to an array and sort by updatedAt
    const recentProjects = Array.from(combinedProjectsMap.values())
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5); // Ensure only top 5 after combining

    res.status(200).json({
      success: true,
      data: recentProjects
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collaborator/profile
// @desc    Get the current collaborator's profile data
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user by ID and exclude password
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext); // Filename with extension
  },
});

const upload = multer({ storage: storage });

// @route   PUT /api/collaborator/profile
// @desc    Update the current collaborator's profile data
// @access  Private
router.put('/profile', upload.single('photo'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, contactNumber, skills, portfolioLinks, bio } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user fields
    user.name = name ?? user.name;
    user.contactNumber = contactNumber ?? user.contactNumber;
    // Handle skills and portfolioLinks as JSON strings if sent that way
    if (skills) {
      try {
        user.skills = JSON.parse(skills);
      } catch (e) {
        user.skills = skills.split(',').map(s => s.trim()); // Fallback if not JSON, assume comma-separated
      }
    } else {
      user.skills = user.skills; // Keep existing if not provided
    }

    if (portfolioLinks) {
      try {
        user.portfolioLinks = JSON.parse(portfolioLinks);
      } catch (e) {
        user.portfolioLinks = portfolioLinks.split(',').map(l => l.trim()); // Fallback if not JSON, assume comma-separated
      }
    } else {
      user.portfolioLinks = user.portfolioLinks; // Keep existing if not provided
    }

    user.name = name ?? user.name;
    user.contactNumber = contactNumber ?? user.contactNumber;
    user.bio = bio ?? user.bio;

    if (req.file) {
      user.photo = req.file.path; // Save the file path to the user model
    }

    await user.save();

    // Return updated user excluding password
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ msg: 'Profile updated successfully', user: userResponse });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/collaborator/my-projects/completed/:projectId/contributions
// @desc    Update a collaborator's contributions to a completed project
// @access  Private
router.put('/my-projects/completed/:projectId/contributions', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { myContributions } = req.body; // The new contribution text
    const userId = req.user.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found.' });
    }

    // Ensure the current user is a collaborator on this project
    if (!project.collaborators.includes(userId)) {
      return res.status(403).json({ msg: 'Not authorized to update contributions for this project.' });
    }

    // Find if an entry for this collaborator already exists
    const existingContributionIndex = project.contributions.findIndex(
      (c) => c.collaborator.toString() === userId
    );

    if (existingContributionIndex > -1) {
      // Update existing contribution
      project.contributions[existingContributionIndex].text = myContributions;
    } else {
      // Add new contribution entry for this collaborator
      project.contributions.push({ collaborator: userId, text: myContributions });
    }

    await project.save();

    res.json({ msg: 'Contribution updated successfully.', project });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/collaborator/my-projects/completed/:projectId/contributions
// @desc    Update a collaborator's contributions to a completed project
// @access  Private
router.put('/my-projects/completed/:projectId/contributions', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { myContributions } = req.body; // The new contribution text
    const userId = req.user.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found.' });
    }

    // Ensure the current user is a collaborator on this project
    if (!project.collaborators.includes(userId)) {
      return res.status(403).json({ msg: 'Not authorized to update contributions for this project.' });
    }

    // Find if an entry for this collaborator already exists
    const existingContributionIndex = project.contributions.findIndex(
      (c) => c.collaborator.toString() === userId
    );

    if (existingContributionIndex > -1) {
      // Update existing contribution
      project.contributions[existingContributionIndex].text = myContributions;
    } else {
      // Add new contribution entry for this collaborator
      project.contributions.push({ collaborator: userId, text: myContributions });
    }

    await project.save();

    res.json({ msg: 'Contribution updated successfully.', project });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


export default router;
