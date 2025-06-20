import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  techStack: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ["Planning", "In Progress", "Completed", "On Hold"],
    default: "Planning"
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  timeline: {
    start: Date,
    end: Date
  },
  attachments: [String],
  feedback: [{
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  contributions: [{
    collaborator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for collaborators count
ProjectSchema.virtual('collaboratorsCount').get(function() {
  return (this.collaborators || []).length;
});

export default mongoose.model("Project", ProjectSchema);
