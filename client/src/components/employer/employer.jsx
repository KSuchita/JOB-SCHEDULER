import React, { useState } from "react";
import axios from "axios";

function Employer() {
  const [showForm, setShowForm] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newJob, setNewJob] = useState({
    jobId: `JOB${Math.floor(Math.random() * 100000)}`,
    company: "",
    jobtype: "",
    domain: "",
    jobinfo: { joblevel: "", experience: "", location: "" },
    dateOfCreation: new Date().toISOString(),
    dateOfModification: new Date().toISOString(),
    isJobActive: true,
  });

  // Updated API URL
  const apiBaseUrl = "http://localhost:3000/employer-api/jobs";  // for posting new job
  const fetchJobsUrl = "http://localhost:3000/employer-api/job";  // for fetching jobs

  const [expandedJob, setExpandedJob] = useState(null); // Track which job's details are expanded

  // Handle input changes for job fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for nested jobinfo fields
  const handleJobInfoChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({
      ...prev,
      jobinfo: {
        ...prev.jobinfo,
        [name]: value,
      },
    }));
  };

  // Function to fetch jobs from API
  const handleFetchJobs = async () => {
    try {
      setError("");
      const response = await axios.get(fetchJobsUrl);  // Changed to fetch from /job endpoint
      console.log("Fetched Jobs:", response.data); // Debugging
      setJobs(response.data.payload || response.data);
      setShowJobs(true);
      setShowForm(false);
    } catch (err) {
      setError("Unable to fetch jobs. Please try again.");
    }
  };

  // Function to post a new job
  const handlePostJob = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newJob.company || !newJob.jobtype || !newJob.jobinfo.joblevel || !newJob.jobinfo.experience || !newJob.jobinfo.location) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      await axios.post(apiBaseUrl, newJob);  // Changed to post to /jobs endpoint
      setSuccess("Job posted successfully!");
      setShowForm(false);
      setNewJob({
        jobId: `JOB${Math.floor(Math.random() * 100000)}`,
        company: "",
        jobtype: "",
        domain: "",
        jobinfo: { joblevel: "", experience: "", location: "" },
        dateOfCreation: new Date().toISOString(),
        dateOfModification: new Date().toISOString(),
        isJobActive: true,
      });
    } catch (err) {
      setError("Unable to post the job. Please try again.");
    }
  };

  // Function to toggle the expanded job details
  const handleReadMore = (jobId) => {
    setExpandedJob((prev) => (prev === jobId ? null : jobId)); // Toggle the expanded job
  };

  return (
    <div className="container my-4 p-4 border rounded">
      <h1>Employer Dashboard</h1>

      {/* Buttons to toggle between form and job list */}
      {!showForm && !showJobs && (
        <div>
          <button className="btn btn-primary me-3" onClick={() => { setShowForm(true); setShowJobs(false); }}>
            Add New Job
          </button>
          <button className="btn btn-info" onClick={handleFetchJobs}>
            View All Jobs
          </button>
        </div>
      )}

      {/* Job Posting Form */}
      {showForm && (
        <form onSubmit={handlePostJob} className="mt-4">
          <h3>Post a New Job</h3>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <div className="mb-3">
            <label className="form-label">Company Name</label>
            <input type="text" name="company" className="form-control" value={newJob.company} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Job Type</label>
            <input type="text" name="jobtype" className="form-control" value={newJob.jobtype} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Domain</label>
            <input type="text" name="domain" className="form-control" value={newJob.domain} onChange={handleInputChange} />
          </div>

          <h4>Job Details</h4>
          <div className="mb-3">
            <label className="form-label">Job Level</label>
            <input type="text" name="joblevel" className="form-control" value={newJob.jobinfo.joblevel} onChange={handleJobInfoChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Experience (Years)</label>
            <input type="number" name="experience" className="form-control" value={newJob.jobinfo.experience} onChange={handleJobInfoChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input type="text" name="location" className="form-control" value={newJob.jobinfo.location} onChange={handleJobInfoChange} required />
          </div>

          <button type="submit" className="btn btn-success">Post Job</button>
          <button type="button" className="btn btn-secondary ms-3" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      {/* Job Listings */}
      {showJobs && (
        <div className="mt-4">
          <h3>All Jobs</h3>
          {error && <p className="text-danger">{error}</p>}
          {jobs.length === 0 ? (
            <p>No jobs available.</p>
          ) : (
            <div className="row">
              {jobs.map((job) => (
                <div key={job.jobId} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{job.company}</h5>
                      <p className="card-text">Job Type: {job.jobtype}</p>
                      <button className="btn btn-info" onClick={() => handleReadMore(job.jobId)}>
                        {expandedJob === job.jobId ? "Show Less" : "Read More"}
                      </button>

                      {/* Show additional job details if expanded */}
                      {expandedJob === job.jobId && (
                        <div className="mt-3">
                          <p><strong>Domain:</strong> {job.domain}</p>
                          <p><strong>Job Level:</strong> {job.jobinfo.joblevel}</p>
                          <p><strong>Experience:</strong> {job.jobinfo.experience} years</p>
                          <p><strong>Location:</strong> {job.jobinfo.location}</p>
                          <p><strong>Posted On:</strong> {new Date(job.dateOfCreation).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-secondary mt-3" onClick={() => setShowJobs(false)}>Back</button>
        </div>
      )}
    </div>
  );
}

export default Employer;