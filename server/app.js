import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "pino-http";
import { createStream } from "rotating-file-stream";
import db from "./db_driver.js"; // Assuming this handles DB connection on import
import apiRouter from "./controllers/index.js"; // Import the main API router
import dotenv from "dotenv";

dotenv.config();
export const app = express();


// Middleware Setup
app.use(cors()); // Enable CORS for all origins (adjust in production)

// Logging
app.use(morgan("dev")); // Dev logging to console
app.use(logger({transport:{target:"pino-pretty"}})); // Pino logging

// create a rotating write stream for file logging
const accessLogStream = createStream("access.log", {
  interval: "1d", // rotate daily
  path: "./logs", // Ensure this directory exists or handle creation
});
// setup the file logger
app.use(morgan("combined", { stream: accessLogStream }));

// Body Parser Middleware
app.use(express.json()); // To parse JSON request bodies

import fs from 'fs';
import path from 'path';
import { log } from "console";
import mlRecommendationService from './services/mlRecommendationService.js'; // Import the ML service

// Check if uploads directory exists, create if not
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Mount API Routes
app.use('/uploads', express.static('uploads')); // Serve the uploads directory as static
app.use("/api", apiRouter);

// Basic 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Basic Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error", error: err.message }); // Avoid sending stack trace in production
});

// Initialize ML Recommendation Service
mlRecommendationService.initialize().catch(error => {
    console.error('Failed to initialize ML Recommendation Service:', error);
});

// Use standard Node.js environment detection for PORT
let PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    app.listen(PORT, () => console.log(`Server running in production on port ${PORT}`));
} else {
    app.listen(PORT, () => console.log(`Server running in development on port ${PORT}`));
}

// Note: For development, you might run this via Vite or nodemon.
// The `export const app = express();` line is often used with Vite's server entry.
