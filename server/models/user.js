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
  date: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
});

UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("User", UserSchema);
