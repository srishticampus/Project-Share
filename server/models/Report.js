import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  contentType: {
    type: String,
    enum: ["Project", "Comment", "Message"],
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateReported: {
    type: Date,
    default: Date.now,
  },
  reason: {
    type: String,
    enum: ["Inappropriate", "Spam", "Harassment", "Other"],
    required: true,
  },
  description: {
    type: String,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // Reference to the reported content (Project, Comment, or Message)
  },
  action: {
    type: String,
    enum: ["Remove", "Keep with notes"],
  },
});

export default mongoose.model("Report", ReportSchema);