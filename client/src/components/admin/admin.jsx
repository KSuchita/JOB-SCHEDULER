import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Container, Table } from "react-bootstrap"; // Using React Bootstrap for layout
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Admin() {
  const [jobs, setJobs] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [error, setError] = useState(""); // General error state
  const [loading, setLoading] = useState(true); // Loading state
  const [visibleJobs, setVisibleJobs] = useState(5); // Initially display 5 jobs
  const [visibleEmployers, setVisibleEmployers] = useState(5); // Initially display 5 employers
  const [visibleJobSeekers, setVisibleJobSeekers] = useState(5); // Initially display 5 job seekers
  const [selectedJob, setSelectedJob] = useState(null); // Store selected job for "Read More" functionality
  const [showJobs, setShowJobs] = useState(true); // Toggle between jobs list and job details

  const apiBaseUrl = "http://localhost:3000/admin-api"; // Replace with your API base URL

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse, employersResponse, jobSeekersResponse] = await Promise.all([
          axios.get(`${apiBaseUrl}/jobs`),
          axios.get(`${apiBaseUrl}/employers`),
          axios.get(`${apiBaseUrl}/jobseekers`),
        ]);

        setJobs(jobsResponse.data.payload || []);
        setEmployers(employersResponse.data.payload || []);
        setJobSeekers(jobSeekersResponse.data.payload || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError("Unable to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl]);

  const handleShowMoreJobs = () => setVisibleJobs(visibleJobs + 5);
  const handleShowMoreEmployers = () => setVisibleEmployers(visibleEmployers + 5);
  const handleShowMoreJobSeekers = () => setVisibleJobSeekers(visibleJobSeekers + 5);

  // Data for pictorial representation (bar chart)
  const userData = {
    labels: ["Jobs", "Employers", "Job Seekers"],
    datasets: [
      {
        label: "User Count",
        data: [jobs.length, employers.length, jobSeekers.length],
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
        borderColor: ["#388e3c", "#1976d2", "#f57c00"],
        borderWidth: 1,
      },
    ],
  };

  const handleReadMore = (jobId) => {
    const job = jobs.find((job) => job.jobId === jobId);
    setSelectedJob(job);
    setShowJobs(false); // Show job details instead of the list
  };

  const handleGoBack = () => {
    setSelectedJob(null);
    setShowJobs(true); // Show the job list again
  };

  return (
    <Container className="my-4 p-4 border rounded">
      <h1>Admin Dashboard</h1>
      {loading && <p>Loading data...</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Bar Chart - User Count Visualization */}
      <h3 className="mt-4">Platform User Count</h3>
      <div className="mb-4" style={{ maxWidth: "600px", margin: "auto" }}>
        <Bar 
          data={userData} 
          options={{ 
            responsive: true, 
            plugins: { legend: { position: "top" } },
            maintainAspectRatio: false 
          }} 
          height={250} // Adjust height here
        />
      </div>

      {/* Platform Statistics */}
      <h3 className="mt-4">Platform Statistics</h3>
      <Table bordered responsive>
        <tbody>
          <tr>
            <td>Total Jobs</td>
            <td>{jobs.length}</td>
          </tr>
          <tr>
            <td>Total Employers</td>
            <td>{employers.length}</td>
          </tr>
          <tr>
            <td>Total Job Seekers</td>
            <td>{jobSeekers.length}</td>
          </tr>
        </tbody>
      </Table>

      {/* Jobs Section */}
      {showJobs ? (
        <>
          <h3 className="mt-4">All Jobs</h3>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Company</th>
                <th>Job Type</th>
                <th>Status</th>
                <th>Location</th>
                <th>Experience</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, visibleJobs).map((job) => (
                <tr key={job.jobId}>
                  <td>{job.jobId}</td>
                  <td>{job.company}</td>
                  <td>{job.jobtype}</td>
                  <td>{job.isJobActive ? "Active" : "Inactive"}</td>
                  <td>{job.jobinfo.location}</td>
                  <td>{job.jobinfo.experience} years</td>
                  <td>
                    <Button variant="primary" onClick={() => handleReadMore(job.jobId)}>
                      Read More
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {visibleJobs < jobs.length && (
            <Button variant="primary" onClick={handleShowMoreJobs}>
              Show More Jobs
            </Button>
          )}
        </>
      ) : (
        <>
          {/* Show selected job details */}
          {selectedJob && (
            <div>
              <h3>Job Details</h3>
              <Card className="my-3">
                <Card.Body>
                  <Card.Title>{selectedJob.jobId}: {selectedJob.company}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Job Type: {selectedJob.jobtype}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Domain:</strong> {selectedJob.domain}<br />
                    <strong>Experience:</strong> {selectedJob.jobinfo.experience} years<br />
                    <strong>Location:</strong> {selectedJob.jobinfo.location}<br />
                    <strong>Job Level:</strong> {selectedJob.jobinfo.joblevel}<br />
                  </Card.Text>
                  <Button variant="secondary" onClick={handleGoBack}>
                    Back to Jobs List
                  </Button>
                </Card.Body>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Employers Section */}
      <h3 className="mt-4">All Employers</h3>
      <Table bordered responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employers.slice(0, visibleEmployers).map((employer) => (
            <tr key={employer.email}>
              <td>{employer.firstName} {employer.lastName}</td>
              <td>{employer.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {visibleEmployers < employers.length && (
        <Button variant="primary" onClick={handleShowMoreEmployers}>
          Show More Employers
        </Button>
      )}

      {/* Job Seekers Section */}
      <h3 className="mt-4">All Job Seekers</h3>
      <Table bordered responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {jobSeekers.slice(0, visibleJobSeekers).map((jobSeeker) => (
            <tr key={jobSeeker.email}>
              <td>{jobSeeker.firstName} {jobSeeker.lastName}</td>
              <td>{jobSeeker.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {visibleJobSeekers < jobSeekers.length && (
        <Button variant="primary" onClick={handleShowMoreJobSeekers}>
          Show More Job Seekers
        </Button>
      )}
    </Container>
  );
}

export default Admin;
