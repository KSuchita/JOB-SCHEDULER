import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { empJsContextObj } from "../../contexts/empJsContext";

function Jobs() {
  const { currentJs } = useContext(empJsContextObj); // User context
  const [jobs, setJobs] = useState([]); // Job listings state
  const [newJob, setNewJob] = useState({ title: "", description: "", company: "" }); // New job state
  const [error, setError] = useState(""); // Error handling
  const [success, setSuccess] = useState(""); // Success handling

  const apiBaseUrl = "http://localhost:3000/jobseeker-api/job"; // API base URL

  // Fetch jobs for jobseekers
  useEffect(() => {
    if (currentJs?.role === "jobseeker") {
      axios
        .get(`${apiBaseUrl}/jobs-api/jobs`)
        .then((response) => {
          setJobs(response.data.payload);
        })
        .catch((err) => {
          console.error("Error fetching jobs:", err.message);
          setError("Unable to fetch job listings.");
        });
    }
  }, [currentJs]);

  // Handle input changes for posting new jobs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit job posting (employer)
  const handlePostJob = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newJob.title || !newJob.description || !newJob.company) {
      setError("Please fill all the fields.");
      return;
    }

    axios
      .post(`${apiBaseUrl}/jobs-api/jobs`, newJob)
      .then((response) => {
        setSuccess("Job posted successfully!");
        setNewJob({ title: "", description: "", company: "" }); // Reset the form
      })
      .catch((err) => {
        console.error("Error posting job:", err.message);
        setError("Unable to post the job. Please try again.");
      });
  };

  // Combined functionality
  return (
    <div className="container my-4 p-4 border rounded" style={{ fontFamily: "Arial, sans-serif", fontSize: "18px" }}>
      {currentJs?.role === "employer" && (
        <div>
          <h1 className="mb-4">Employer Dashboard</h1>
          <form onSubmit={handlePostJob} className="mb-5">
            <h3 className="mb-3">Post a New Job</h3>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Job Title</label>
              <input
                type="text"
                name="title"
                id="title"
                className="form-control"
                value={newJob.title}
                onChange={handleInputChange}
                placeholder="Enter job title"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Job Description</label>
              <textarea
                name="description"
                id="description"
                className="form-control"
                value={newJob.description}
                onChange={handleInputChange}
                placeholder="Enter job description"
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="company" className="form-label">Company Name</label>
              <input
                type="text"
                name="company"
                id="company"
                className="form-control"
                value={newJob.company}
                onChange={handleInputChange}
                placeholder="Enter company name"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Post Job</button>
          </form>
        </div>
      )}

      {currentJs?.role === "jobseeker" && (
        <div>
          <h1 className="mb-4">Jobseeker Dashboard</h1>
          <h3 className="mb-3">Available Jobs</h3>
          {error && <p className="text-danger">{error}</p>}
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div key={index} className="card my-3 shadow-sm">
                <div className="card-body">
                  <h4 className="card-title">{job.title}</h4>
                  <p className="card-text">{job.description}</p>
                  <p className="text-muted">Company: {job.company}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No jobs available at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Jobs;
