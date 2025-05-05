import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Application message is required'],
    trim: true,
    maxlength: [500, 'Application message cannot exceed 500 characters'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Application', ApplicationSchema);