const expressAsyncHandler = require("express-async-handler");
const express = require("express");
const employerApp = express.Router();
const EmployerModel = require("../models/employerModel");
const JobModel = require("../models/jobModel");

// Create a new job
employerApp.post("/jobs", expressAsyncHandler(async (req, res) => {
    try {
        const newJob = new JobModel(req.body);
        const jobObj = await newJob.save();
        res.status(201).send({ message: "Job created", payload: jobObj });
    } catch (error) {
        console.error("Error creating job:", error.message);
        res.status(500).send({ message: "Error creating job", error: error.message });
    }
}));

// Read all active jobs
employerApp.get("/job", expressAsyncHandler(async (req, res) => {
    try {
        const listOfJobs = await JobModel.find({ isJobActive: true });
        if (listOfJobs.length === 0) {
            return res.status(404).send({ message: "No active jobs found" });
        }
        res.status(200).send({ message: "Jobs", payload: listOfJobs });
    } catch (error) {
        console.error("Error fetching jobs:", error.message);
        res.status(500).send({ message: "Error fetching jobs", error: error.message });
    }
}));

// Modify a job by job ID
employerApp.put("/job/:jobId", expressAsyncHandler(async (req, res) => {
    try {
        const modifiedJob = {
            ...req.body,
            dateOfModification: new Date().toISOString() // Update modification date
        };
        const latestJob = await JobModel.findByIdAndUpdate(
            req.params.jobId,
            modifiedJob,
            { new: true } // Get the updated document
        );
        if (!latestJob) {
            return res.status(404).send({ message: "Job not found" });
        }
        res.status(200).send({ message: "Job modified successfully", payload: latestJob });
    } catch (error) {
        console.error("Error modifying job:", error.message);
        res.status(500).send({ message: "Error modifying job", error: error.message });
    }
}));

// Soft delete or restore a job
employerApp.put("/job/:jobId/toggle", expressAsyncHandler(async (req, res) => {
    try {
        const { isJobActive } = req.body; // Toggle `isJobActive` value
        const updatedJob = await JobModel.findByIdAndUpdate(
            req.params.jobId,
            { isJobActive },
            { new: true }
        );
        if (!updatedJob) {
            return res.status(404).send({ message: "Job not found" });
        }
        res.status(200).send({
            message: `Job successfully ${isJobActive ? "restored" : "deleted"}`,
            payload: updatedJob
        });
    } catch (error) {
        console.error("Error toggling job status:", error.message);
        res.status(500).send({ message: "Error toggling job status", error: error.message });
    }
}));

// Create or retrieve an employer
employerApp.post("/employer", expressAsyncHandler(async (req, res) => {
    try {
        const newEmployer = req.body;
        const EmpInDb = await EmployerModel.findOne({ email: newEmployer.email });

        if (EmpInDb) {
            if (newEmployer.role === EmpInDb.role) {
                return res.status(200).send({ message: newEmployer.role, payload: EmpInDb });
            }
            return res.status(400).send({ message: "Invalid role" });
        }

        const newEmployerDoc = new EmployerModel(newEmployer);
        const savedEmployer = await newEmployerDoc.save();
        res.status(201).send({ message: savedEmployer.role, payload: savedEmployer });
    } catch (error) {
        console.error("Error creating employer:", error.message);
        res.status(500).send({ message: "Error creating employer", error: error.message });
    }
}));

module.exports = employerApp;
