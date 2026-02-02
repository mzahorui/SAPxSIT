// Import the SAP Cloud Application Programming Model core library
const cds = require("@sap/cds");
// Import Express framework for handling HTTP requests and routing
const express = require("express");
// Import Multer middleware for handling multipart/form-data (file uploads)
const multer = require("multer");
// Import Node.js crypto module to generate secure random tokens
const crypto = require("crypto");
// Import path module for cross-platform file path manipulations
const path = require("path");
// Import filesystem module to interact with the server's disk
const fs = require("fs");

// Define absolute path for the uploads folder where files will be stored
const UPLOAD_DIR = path.join(__dirname, "uploads");
// Define absolute path for the public folder serving static HTML/JS files
const PUBLIC_DIR = path.join(__dirname, "public");
// Set Token Time-To-Live to 15 minutes in milliseconds
const TOKEN_TTL_MS = 15 * 1000 * 60; 

// Check if the upload directory exists; if not, create it recursively
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// In-memory data structure to store valid tokens and their expiry timestamps
const tokens = new Map();

// Configure Multer storage engine to save files directly to the disk
const storage = multer.diskStorage({
  // Specify the destination directory for uploaded files
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  // Define how the uploaded files should be named on the server
  filename: (req, file, cb) => {
    // Sanitize the original filename by replacing non-alphanumeric chars with underscores
    const safeName = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    // Generate a timestamp to ensure file uniqueness and prevent overwriting
    const stamp = Date.now();
    // Return the final filename: timestamp followed by the safe original name
    cb(null, `${stamp}-${safeName}`);
  },
});

// Initialize Multer instance with the storage config and a 50MB file size limit
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Helper function to generate a cryptographically strong 32-character hex token
function createToken() {
  return crypto.randomBytes(16).toString("hex");
}

// Internal function to check if a token is still in the map and hasn't expired
function isTokenValid(token) {
  // Retrieve the expiry timestamp for the given token
  const expiry = tokens.get(token);
  // If token doesn't exist in the Map, it's invalid
  if (!expiry) return false;
  // If current time is past the expiry time, delete the token and return false
  if (expiry < Date.now()) {
    tokens.delete(token);
    return false;
  }
  // Otherwise, the token is perfectly valid
  return true;
}

// Hook into the CAP bootstrap process to extend the Express app instance
cds.on("bootstrap", (app) => {
  // Add middleware to automatically parse incoming JSON request bodies
  app.use(express.json());
  // Serve all static files (HTML, CSS, JS) located in the 'public' directory
  app.use(express.static(PUBLIC_DIR));

  // Endpoint to generate a new unique upload link
  app.get("/api/link", (req, res) => {
    // Create a fresh token
    const token = createToken();
    // Store token in the Map with a future expiry timestamp
    tokens.set(token, Date.now() + TOKEN_TTL_MS);

    // Construct the full URL using current protocol and host for the client
    const url = `${req.protocol}://${req.get("host")}/upload.html?token=${token}`;
    // Send back the token, full URL, and expiry info as JSON
    res.json({ token, url, expiresInMinutes: TOKEN_TTL_MS / 60000 });
  });

  // Endpoint for the frontend to check if a specific token is still usable
  app.get("/api/link/:token", (req, res) => {
    // Extract token from the URL path parameter
    const token = req.params.token;
    // Validate it and return the boolean result
    res.json({ valid: isTokenValid(token) });
  });

  // Main upload endpoint; protected by the token and handled by Multer
  app.post("/api/upload/:token", upload.single("file"), (req, res) => {
    // Extract token from the URL path parameter
    const token = req.params.token;

    // Check if the token provided in the URL is valid
    if (!isTokenValid(token)) {
      // If a file was already streamed to disk by Multer, delete it immediately
      if (req.file?.path) {
        fs.unlink(req.file.path, () => {});
      }
      // Return a 400 Bad Request error to the client
      return res.status(400).json({ error: "Invalid or expired link." });
    }

    // Immediately delete the token after use to ensure the link is single-use
    tokens.delete(token);

    // Check if Multer actually received a file from the request
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Return success response with details about the saved file
    res.json({
      ok: true,
      filename: req.file.filename,
      size: req.file.size,
    });
  });
});

// Finalize and start the CDS server on the specified port (default 4004)
cds.server({ port: process.env.PORT || 4004 });
