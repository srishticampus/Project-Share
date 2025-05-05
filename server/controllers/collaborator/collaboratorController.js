import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../../middleware/auth.js'; // Import protect middleware
import User from '../../models/user.js'; // Assuming User model is needed
import Project from '../../models/Project.js'; // Assuming Project model is needed
import Application from '../../models/Application.js'; // Assuming Application model is needed
import Task from '../../models/Task.js'; // Assuming Task model is needed
import MentorRequest from '../../models/MentorRequest.js'; // Assuming MentorRequest model is needed

const router = express.Router();

// Protect all collaborator routes
router.use(protect);

// @route   GET /api/collaborator/dashboard/counts
// @desc    Get collaborator dashboard counts
// @access  Private
router.get('/dashboard/counts', async (req, res) => {
  try {
    const userId = req.user.id;

    // Count applied projects
    const appliedProjectsCount = await Application.countDocuments({ applicant: userId });

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

    res.json(projects);
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

    res.json(project);
  } catch (err) {
    console.error(err.message);
    // Check if the error is due to an invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
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
    console.log('User ID:', userId);
    console.log('req.user:', req.user);

    // Find applications by the current user and populate project details
    const applications = await Application.find({ applicantId: userId }).populate({
      path: 'projectId',
      select: 'title creator category',
      populate: {
        path: 'creator',
        select: 'name',
      },
    });
    console.log("Applications found:", applications);
    // const populatedApplications = await Application.find({ applicantId: userId }).populate({
    //   path: 'projectId',
    //   select: 'title creator category',
    //   populate: {
    //     path: 'creator',
    //     select: 'name',
    //   }, // Assuming creator is populated in project
    // });
    //  console.log("Populated Applications:", populatedApplications);

    // We might want to return a list of projects with application status,
    // rather than a list of applications. Let's transform the result.
    const appliedProjects = applications.map(app => {
      console.log("app.projectId:", app.projectId);
      return {
        _id: app.projectId._id,
        projectTitle: app.projectId.title,
        creator: app.projectId.creator, // Assuming creator is populated in project
        category: app.projectId.category,
        status: app.status,
        applicationDate: app.createdAt, // Assuming createdAt is the application date
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
    }).populate('creator', 'name').populate('category'); // Populate creator name

    res.json(completedProjects);
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

    // Fetch user profile data
    const user = await User.findById(userId).select('skills portfolioLinks bio');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find completed projects marked for portfolio
    const completedProjects = await Project.find({
      collaborators: userId,
      status: 'Completed',
      addToPortfolio: true, // Assuming a field like this exists in the Project model
    }).select('title'); // Select only the title

    const portfolio = {
      skillsShowcase: user.skills,
      portfolioLinks: user.portfolioLinks,
      bio: user.bio,
      projects: completedProjects,
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
    user.skills = skills ?? user.skills;
    user.portfolioLinks = portfolioLinks ?? user.portfolioLinks;
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


export default router;