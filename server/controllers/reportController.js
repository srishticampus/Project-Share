import Report from '../models/Report.js'; // Assuming the Report model exists

const submitReport = async (req, res) => {
  try {
    const { reportType, reportId, reason, description } = req.body;

    // Basic validation
    if (!reportType || !reportId || !reason) {
      return res.status(400).json({ message: 'Missing required fields: reportType, reportId, and reason are required.' });
    }

    // Create a new report instance
    const newReport = new Report({
      contentType: reportType, // Map reportType from request to contentType in model
      contentId: reportId, // Map reportId from request to contentId in model
      reason,
      description,
      reportedBy: req.user ? req.user._id : null, // Assuming user info is in req.user
      status: 'pending', // Default status
    });

    // Save the report to the database
    await newReport.save();

    res.status(201).json({ message: 'Report submitted successfully.', report: newReport });

  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ message: 'Failed to submit report.', error: error.message });
  }
};

export {
  submitReport,
};