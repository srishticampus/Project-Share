#!/usr/bin/env node
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.js";
import db from "./db_driver.js";

const createAdmin = async () => {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    if (args.length !== 3) {
      throw new Error(
        "Usage: create-admin.js <name> <email> <password>"
      );
    }
    const [username, email, password] = args;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if the user already exists
    let adminUser = await User.findOne({ email });

    if (adminUser) {
      // Update the existing user
      adminUser.name = username;
      adminUser.password = hashedPassword;
    } else {
      // Create a new admin user
      adminUser = new User({
        name: username,
        email: email,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });
    }

    // Save the admin user to the database
    await adminUser.save();

    console.log("Admin user created/updated successfully!");
  } catch (error) {
    console.error("Error creating/updating admin user:", error.message);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();