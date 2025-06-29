  import React, { useState, useEffect } from "react";
  import axios from "axios";

  function Jobseeker() {
    const [jobs, setJobs] = useState([]); // Job listings state
    const [error, setError] = useState(""); // Error handling

    const apiBaseUrl = "http://localhost:3000/jobseeker-api/job"; // Base URL for fetching jobs

    // Fetch jobs on component mount
    useEffect(() => {
      axios
        .get(apiBaseUrl) // Use the correct endpoint
        .then((response) => {
          setJobs(response.data.payload); // Set jobs using the response's payload
        })
        .catch((err) => {
          console.error("Error fetching jobs:", err.message);
          setError("Unable to fetch job listings.");
        });
    }, []);

    return (
      <div className="container my-4 p-4 border rounded" style={{ fontFamily: "Arial, sans-serif", fontSize: "18px" }}>
        <h1>Jobseeker Dashboard</h1>
        <h3 className="mt-4">Available Jobs</h3>
        {error && <p className="text-danger">{error}</p>}
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.jobId}
              className="card my-3 shadow-sm"
              style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }} // Light background styling
            >
              <div className="card-body">
                <h4 className="card-title">{job.jobId}: {job.company}</h4>
                <p className="card-text">
                  <strong>Job Type:</strong> {job.jobtype}<br />
                  <strong>Domain:</strong> {job.domain}<br />
                  <strong>Job Level:</strong> {job.jobinfo.joblevel}<br />
                  <strong>Experience:</strong> {job.jobinfo.experience} years<br />
                  <strong>Location:</strong> {job.jobinfo.location}<br />
                  <strong>Date of Creation:</strong> {job.dateOfCreation}<br />
                  <strong>Date of Modification:</strong> {job.dateOfModification}<br />
                  <strong>Status:</strong> {job.isJobActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No jobs available at the moment.</p>
        )}
      </div>
    );
  }

  export default Jobseeker;
