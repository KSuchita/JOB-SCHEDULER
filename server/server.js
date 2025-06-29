const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const jobseekerApp = require("./API's/jobseekerApi");
const employerApp = require("./API's/employerApi"); // Correctly using employerApi.js
const adminApp = require("./API's/adminApi");
const JobModel = require("./models/jobModel"); // Import JobModel

const port = process.env.PORT || 3000;

// Middleware Setup
app.use(cors());
app.use(express.json()); // Parsing JSON payloads

// MongoDB Connection
mongoose
  .connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connection successful");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  })
  .catch((err) => {
    console.error("Error in database connection:", err.message);
  });

// Logging Middleware
app.use((err, req, res, next) => {
  console.log("errObject in express error handler:", err);
  res.send({ message: err.message });
});

// API Routes
app.use("/jobseeker-api", jobseekerApp);
app.use("/employer-api", employerApp); // Using employerApi.js
app.use("/admin-api", adminApp);

// Default Route for Undefined Routes
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// MongoDB Connection Events (Optional)
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected.");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected.");
});
