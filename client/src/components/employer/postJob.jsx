import React, { useState } from "react";
import axios from "axios";

function PostJob() {
  const [jobDetails, setJobDetails] = useState({
    jobId: `JOB${Math.floor(Math.random() * 100000)}`, // Auto-generate jobId
    company: "",
    jobtype: "",
    domain: "",
    jobinfo: {
      joblevel: "",
      experience: "",
      location: "",
    },
    dateOfCreation: new Date().toISOString(), // Current date in ISO format
    dateOfModification: new Date().toISOString(), // Current date in ISO format
    isJobActive: true, // Default value
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const apiBaseUrl = "http://localhost:3000/employer-api/jobs"; // Replace with actual API base URL

  // Handle input changes for top-level fields of jobDetails
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle input changes for nested jobinfo fields
  const handleJobInfoChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      jobinfo: {
        ...prevDetails.jobinfo,
        [name]: value,
      },
    }));
  };

  // Handle job posting
  const handlePostJob = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate required fields
    if (
      !jobDetails.jobId ||
      !jobDetails.company ||
      !jobDetails.jobtype ||
      !jobDetails.dateOfCreation ||
      !jobDetails.dateOfModification ||
      !jobDetails.jobinfo.joblevel ||
      !jobDetails.jobinfo.experience ||
      !jobDetails.jobinfo.location
    ) {
      setError("Please fill in all required fields before submitting.");
      return;
    }

    // Make POST request to API
    axios
      .post(apiBaseUrl, jobDetails)
      .then((response) => {
        setSuccess("Job posted successfully!");
        setJobDetails({
          jobId: `JOB${Math.floor(Math.random() * 100000)}`, // Reset with new jobId
          company: "",
          jobtype: "",
          domain: "",
          jobinfo: { joblevel: "", experience: "", location: "" },
          dateOfCreation: new Date().toISOString(),
          dateOfModification: new Date().toISOString(),
          isJobActive: true,
        });
      })
      .catch((err) => {
        console.error("Error posting job:", err.message);
        setError("An error occurred while posting the job. Please try again.");
      });
  };

  return (
    <div className="container my-4 p-4 border rounded" style={{ fontFamily: "Arial, sans-serif", fontSize: "18px" }}>
      <h1 className="mb-4">Post a New Job</h1>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}
      <form onSubmit={handlePostJob}>
        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            name="company"
            className="form-control"
            value={jobDetails.company}
            onChange={handleInputChange}
            placeholder="Enter company name"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Job Type</label>
          <input
            type="text"
            name="jobtype"
            className="form-control"
            value={jobDetails.jobtype}
            onChange={handleInputChange}
            placeholder="e.g., Full-Time, Part-Time"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Domain</label>
          <input
            type="text"
            name="domain"
            className="form-control"
            value={jobDetails.domain}
            onChange={handleInputChange}
            placeholder="e.g., Software Development"
          />
        </div>
        <h3 className="mt-4">Job Description</h3>
        <div className="mb-3">
          <label className="form-label">Job Level</label>
          <input
            type="text"
            name="joblevel"
            className="form-control"
            value={jobDetails.jobinfo.joblevel}
            onChange={handleJobInfoChange}
            placeholder="e.g., Entry Level, Senior Level"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Experience (Years)</label>
          <input
            type="number"
            name="experience"
            className="form-control"
            value={jobDetails.jobinfo.experience}
            onChange={handleJobInfoChange}
            placeholder="Enter required experience"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={jobDetails.jobinfo.location}
            onChange={handleJobInfoChange}
            placeholder="Enter job location"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Creation</label>
          <input
            type="date"
            name="dateOfCreation"
            className="form-control"
            value={jobDetails.dateOfCreation.split("T")[0]} // ISO format for date
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Modification</label>
          <input
            type="date"
            name="dateOfModification"
            className="form-control"
            value={jobDetails.dateOfModification.split("T")[0]} // ISO format for date
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="isJobActive"
            className="form-check-input"
            checked={jobDetails.isJobActive}
            onChange={(e) =>
              setJobDetails((prevDetails) => ({
                ...prevDetails,
                isJobActive: e.target.checked,
              }))
            }
          />
          <label className="form-check-label">Is Job Active?</label>
        </div>
        <button type="submit" className="btn btn-primary">Post Job</button>
      </form>
    </div>
  );
}

export default PostJob;
