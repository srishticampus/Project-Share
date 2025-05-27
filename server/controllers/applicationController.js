import Application from '../models/Application.js';
import Project from '../models/Project.js';
import User from '../models/user.js';

// @desc    Create a new application for a project
// @route   POST /api/applications
// @access  Collaborator
export const createApplication = async (req, res) => {
  try {
    const { projectId, message } = req.body;
    const applicantId = req.user._id; // Assuming user is authenticated and user ID is in req.user._id

    // Check if the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Check if the user has already applied to this project
    const existingApplication = await Application.findOne({ projectId, applicantId });
    if (existingApplication) {
      return res.status(400).json({ success: false, error: 'You have already applied to this project' });
    }

    const application = new Application({
      projectId,
      applicantId,
      message,
    });
    console.log("Application being saved:", application);

    await application.save();
    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get applications for a creator's projects
// @route   GET /api/creator/applications
// @access  Creator
export const getApplicationsForCreatorProjects = async (req, res) => {
  try {
    const creatorId = req.user._id; // Assuming creator is authenticated

    // Find all projects created by the user
    const creatorProjects = await Project.find({ creator: creatorId }).select('_id');
    const projectIds = creatorProjects.map(project => project._id);

    // Find all applications for these projects
    const applications = await Application.find({ projectId: { $in: projectIds } })
      .populate('projectId', 'title') // Populate project title
      .populate('applicantId', 'name email'); // Populate applicant name and email

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching applications for creator projects:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Update application status (Accept/Reject)
// @route   PUT /api/applications/:id/status
// @access  Creator
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    const creatorId = req.user._id; // Assuming creator is authenticated

    // Find the application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Check if the authenticated user is the creator of the project the application is for
    const project = await Project.findById(application.projectId);
    if (!project || project.creator.toString() !== creatorId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this application' });
    }

    // Validate the new status
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status provided' });
    }

    application.status = status;
    await application.save();

    // If accepted, add the applicant as a collaborator to the project and set project status to Active
    if (status === 'Accepted') {
      if (!project.collaborators.includes(application.applicantId)) {
        project.collaborators.push(application.applicantId);
      }
      // Set project status to 'In Progress' if it's not already 'Completed'
      if (project.status !== 'Completed') {
        project.status = 'In Progress';
      }
      await project.save();
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getApplicationDashboardStats = async (req, res) => {
  try {
    const creatorId = req.user._id;

    // Find all projects created by the user
    const creatorProjects = await Project.find({ creator: creatorId }).select('_id');
    const projectIds = creatorProjects.map(project => project._id);

    const totalApplications = await Application.countDocuments({ projectId: { $in: projectIds } });
    const newApplications = await Application.countDocuments({ projectId: { $in: projectIds }, status: 'Pending' });
    const reviewedApplications = await Application.countDocuments({ projectId: { $in: projectIds }, status: { $in: ['Accepted', 'Rejected'] } });
    const acceptedApplications = await Application.countDocuments({ projectId: { $in: projectIds }, status: 'Accepted' });
    const rejectedApplications = await Application.countDocuments({ projectId: { $in: projectIds }, status: 'Rejected' });

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        newApplications,
        reviewedApplications,
        acceptedApplications,
        rejectedApplications,
      }
    });
  } catch (error) {
    console.error('Error fetching application dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
