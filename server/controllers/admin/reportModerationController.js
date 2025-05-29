import Report from '../../models/Report.js'; // Import the Report model

// Get all reports (or pending reports for moderation)
const getReports = async (req, res) => {
  try {
    const { status } = req.query; // Get status from query parameters
    let filter = {};
    console.log(status)
    if (status) {
      filter = { status: status }; // Filter by status if provided
    } else {
      filter = { status: 'pending' }; // Default to pending if no status is provided
    }

    // Populate reportedBy to get user details if needed
    const reports = await Report.find(filter).select('contentType reportedBy dateReported reason description status notes').populate('reportedBy', 'name email'); // Explicitly select notes
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Failed to fetch reports.', error: error.message });
  }
};

// Handle removing a report
const removeReport = async (req, res) => {
  try {
    const { id } = req.params; // Get report ID from URL parameters

    // Find the report by ID and update its status or delete it
    // For now, let's update the status to 'removed'
    const updatedReport = await Report.findByIdAndUpdate(id, { status: 'removed' }, { new: true });

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    // You might also want to perform actions on the reported content itself (e.g., hide or delete)
    // This would depend on your application's logic and the contentType of the report.

    res.status(200).json({ message: 'Report marked as removed.', report: updatedReport });

  } catch (error) {
    console.error('Error removing report:', error);
    res.status(500).json({ message: 'Failed to remove report.', error: error.message });
  }
};

// Handle keeping a report with notes
const keepReport = async (req, res) => {
  try {
    const { id } = req.params; // Get report ID from URL parameters
    const { notes } = req.body; // Get notes from request body

    if (!notes) {
        return res.status(400).json({ message: 'Notes are required to keep a report.' });
    }

    // Find the report by ID and update its status to 'kept' and add notes
    const updatedReport = await Report.findByIdAndUpdate(id, { status: 'kept', action: 'Keep with notes', notes: notes }, { new: true }); // Assuming 'notes' field exists in model
    console.log('Updated report after keeping:', updatedReport); // Add console log

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json({ message: 'Report marked as kept with notes.', report: updatedReport });

  } catch (error) {
    console.error('Error keeping report:', error);
    res.status(500).json({ message: 'Failed to keep report.', error: error.message });
  }
};


// Handle marking a report as resolved
const markReportAsResolved = async (req, res) => {
  try {
    const { id } = req.params; // Get report ID from URL parameters

    // Find the report by ID and update its status to 'resolved'
    const updatedReport = await Report.findByIdAndUpdate(id, { status: 'resolved' }, { new: true });

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json({ message: 'Report marked as resolved.', report: updatedReport });

  } catch (error) {
    console.error('Error marking report as resolved:', error);
    res.status(500).json({ message: 'Failed to mark report as resolved.', error: error.message });
  }
};


export {
  getReports,
  removeReport,
  keepReport,
  markReportAsResolved, // Export the new function
};