import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "creator", "collaborator", "mentor"],
    default: "collaborator",
  },
  photo: {
    type: String, // URL to the profile picture
    default: '', // Default empty string
  },
  contactNumber: {
    type: String,
  },
  skills: {
    type: [String], // Array of skills/expertise
  },
  portfolioLinks: {
    type: [String], // Array of portfolio links (for collaborators)
  },
  areasOfExpertise: {
    type: [String], // Array of expertise areas (for mentors)
  },
  yearsOfExperience: {
    type: Number, // Years of experience (for mentors)
  },
  credentials: {
    type: String, // Credentials or qualifications (for mentors)
  },
  bio: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
  projectInteractionCount: {
    type: Number,
    default: 0,
  },
  taskInteractionCount: {
    type: Number,
    default: 0,
  },
  chatActivityCount: {
    type: Number,
    default: 0,
  },
  followedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
});

UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("User", UserSchema);
