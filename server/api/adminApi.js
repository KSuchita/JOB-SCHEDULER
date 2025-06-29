const expressAsyncHandler = require("express-async-handler");
const exp = require("express");
const adminApp = exp.Router();
const AdminModel = require("../models/adminModel");
const JobModel = require("../models/jobModel"); // Assuming there is a JobModel
const EmployerModel = require("../models/employerModel"); // Assuming there is an EmployerModel
const JobSeekerModel = require("../models/jobSeekerModel"); // Assuming there is a JobSeekerModel

// Add a new or validate an existing admin
adminApp.post(
  "/admin",
  expressAsyncHandler(async (req, res) => {
    const newAdmin = req.body;
    const AdminInDb = await AdminModel.findOne({ email: newAdmin.email });
    if (AdminInDb !== null) {
      if (newAdmin.role === AdminInDb.role) {
        res.status(200).send({ message: newAdmin.role, payload: AdminInDb });
      } else {
        res.status(200).send({ message: "Invalid role" });
      }
    } else {
      let newAdmins = new AdminModel(newAdmin);
      let newAdminDoc = await newAdmins.save();
      res.status(201).send({ message: newAdminDoc.role, payload: newAdminDoc });
    }
  })
);

// Get all jobs
adminApp.get(
  "/jobs",
  expressAsyncHandler(async (req, res) => {
    try {
      const jobs = await JobModel.find();
      res.status(200).send({ message: "Jobs fetched successfully", payload: jobs });
    } catch (err) {
      console.error("Error fetching jobs:", err);
      res.status(500).send({ message: "Failed to fetch jobs" });
    }
  })
);

// Get all employers
adminApp.get(
  "/employers",
  expressAsyncHandler(async (req, res) => {
    try {
      const employers = await EmployerModel.find();
      res.status(200).send({ message: "Employers fetched successfully", payload: employers });
    } catch (err) {
      console.error("Error fetching employers:", err);
      res.status(500).send({ message: "Failed to fetch employers" });
    }
  })
);

// Get all job seekers
adminApp.get(
  "/jobseekers",
  expressAsyncHandler(async (req, res) => {
    try {
      const jobSeekers = await JobSeekerModel.find();
      res.status(200).send({ message: "Job seekers fetched successfully", payload: jobSeekers });
    } catch (err) {
      console.error("Error fetching job seekers:", err);
      res.status(500).send({ message: "Failed to fetch job seekers" });
    }
  })
);

// Toggle job status
adminApp.patch(
  "/jobs/:jobId/toggle",
  expressAsyncHandler(async (req, res) => {
    const { jobId } = req.params;
    try {
      const job = await JobModel.findById(jobId);
      if (job) {
        job.isJobActive = !job.isJobActive;
        await job.save();
        res.status(200).send({ message: "Job status updated successfully", payload: job });
      } else {
        res.status(404).send({ message: "Job not found" });
      }
    } catch (err) {
      console.error("Error toggling job status:", err);
      res.status(500).send({ message: "Failed to toggle job status" });
    }
  })
);

module.exports = adminApp;
