import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String, // Changed to String for direct message content
    required: true,
  },
  type: {
    type: String,
    enum: ['message', 'mentorship_request', 'mentorship_status_update', 'project_feedback'], // Added new types
    required: true, // Made required as it's crucial for notification handling
  },
  relatedEntity: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedEntityType', // Dynamic reference based on relatedEntityType
    required: false, // Optional, as not all notifications will have a related entity
  },
  relatedEntityType: {
    type: String,
    enum: ['Message', 'MentorRequest', 'Project', 'Article'], // Define possible types of related entities
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Notification", NotificationSchema);
