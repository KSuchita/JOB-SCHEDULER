import React, { useContext, useEffect, useState } from "react";
import { empJsContextObj } from "../../contexts/empJsContext";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const { currentJs, setcurrentJs } = useContext(empJsContextObj); // Context values
  const { isSignedIn, user, isLoaded } = useUser(); // Clerk hooks
  const [error, setError] = useState(""); // Error state
  const [success, setSuccess] = useState(""); // Success state
  const navigate = useNavigate();

  // Function to handle role selection
  async function onSelectRole(e) {
    setError("");
    setSuccess("");
    const selectedRole = e.target.value;

    const updatedJs = {
      ...currentJs,
      role: selectedRole,
      profileImageUrl: user?.imageUrl || "No Image Found",
    };

    try {
      const apiBaseUrl = "http://localhost:3000";
      let res = null;

      if (selectedRole === "employer") {
        res = await axios.post(`${apiBaseUrl}/employer-api/employer`, updatedJs);
      } 
      if (selectedRole === "jobseeker") {
        res = await axios.post(`${apiBaseUrl}/jobseeker-api/jobseeker`, updatedJs);
      } 
      if (selectedRole === "admin") {
        res = await axios.post(`${apiBaseUrl}/admin-api/admin`, updatedJs);
      }

      if (res) {
        const { message, payload } = res.data;

        // Handle responses based on the role
        if (message === selectedRole) {
          setcurrentJs({ ...updatedJs, ...payload });
          localStorage.setItem("currentJs", JSON.stringify(payload));
          setSuccess(`${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} role selected successfully!`);
          navigate(`/${selectedRole}-profile/${payload.email}`);
        } else {
          setError(message);
        }
      }
    } catch (err) {
      console.error("Error during role selection:", err.message);
      setError("Unable to complete the request. Please try again.");
    }
  }

  // Sync user details when signed in
  useEffect(() => {
    if (isSignedIn && user) {
      setcurrentJs((prevJs) => ({
        ...prevJs,
        firstName: user.firstName || "No First Name Found",
        lastName: user.lastName || "No Last Name Found",
        email: user.emailAddresses?.[0]?.emailAddress || "No Email Found",
        profileImageUrl: user.imageUrl || "No Image Found",
      }));
    }
  }, [isLoaded, user, setcurrentJs]);

  // Navigate to profile based on current role
  useEffect(() => {
    if (currentJs?.role && error.length === 0) {
      navigate(`/${currentJs.role}-profile/${currentJs.email}`);
    }
  }, [currentJs?.role, navigate]);

  return (
    <div
      className="container my-4 p-4 border rounded"
      style={{ fontFamily: "Arial, sans-serif", fontSize: "18px" }} // Increased font size
    >
      {!isSignedIn && (
        <div className="text-center">
          <h1 className="mb-4">Welcome to the Job Finder Application</h1>
          <img
            src="https://img.freepik.com/free-photo/welcome-phrase-available-launch-open_53876-124476.jpg"
            alt="Welcome"
            className="img-fluid mb-4"
            style={{ maxWidth: "300px", height: "auto" }}
          />
          <p className="text-start">
            In the ever-evolving job market, landing the right opportunity has become more challenging than ever. With
            an abundance of choices and platforms, job seekers often feel lost in the crowd, while employers struggle to
            find candidates who truly align with their requirements. Our job finder application is designed to bridge
            this gap, creating an efficient and reliable solution for both job seekers and recruiters.
          </p>
          <img
            src="https://t4.ftcdn.net/jpg/03/08/69/75/360_F_308697506_9dsBYHXm9FwuW0qcEqimAEXUvzTwfzwe.jpg"
            alt="Technology"
            className="img-fluid my-4"
            style={{ maxWidth: "300px", height: "auto" }}
          />
          <p className="text-start">
            The application harnesses the power of cutting-edge technology, combining advanced algorithms with a
            user-centric approach. By analyzing individual preferences, skills, and career aspirations, the platform
            provides personalized job recommendations tailored to each user. The intuitive interface ensures a seamless
            experience, guiding users through every step of their job search journey—be it crafting the perfect resume,
            applying for relevant positions, or preparing for interviews.
          </p>
          <img
            src="https://hrmasia.com/wp-content/uploads/2024/02/Maximum-Image-A-for-Partner-Content-.jpg"
            alt="Employer Features"
            className="img-fluid my-4"
            style={{ maxWidth: "300px", height: "auto" }}
          />
          <p className="text-start">
            For employers, the application serves as a sophisticated hiring tool, offering features like smart filters,
            AI-driven candidate matching, and automated resume sorting. This not only saves valuable time but also
            ensures that the recruitment process is efficient and precise. Employers can connect with candidates who are
            not just qualified but also a cultural fit for their organizations, paving the way for long-term
            professional success.
          </p>
          <img
            src="https://cdn.prod.website-files.com/650abfbd5bf4d19bcbe2bf85/665df10324db2c841c35f62b_Blog%20Banner%20-%20No-code%20AI%20Empowering%20Non-Technical%20Users.jpg"
            alt="Empowering Users"
            className="img-fluid my-4"
            style={{ maxWidth: "300px", height: "auto" }}
          />
          <p className="text-start">
            Beyond its functional benefits, our platform is rooted in a mission to empower users. It fosters a sense of
            confidence in job seekers, equipping them with the tools and resources they need to succeed in a competitive
            landscape. For recruiters, it simplifies complexities and enhances decision-making, enabling them to focus
            on building strong teams.
          </p>
          <p className="lead">
            Please <a href="/signin" className="text-primary">Sign In</a> to access your profile and get started.
          </p>
        </div>
      )}



      {isSignedIn && (
        <div>
          <div
            className="d-flex justify-content-evenly align-items-center bg-light p-3 mb-4 shadow-sm rounded"
            style={{ border: "1px solid #ddd" }}
          >
            <img
              src={user?.imageUrl || "https://via.placeholder.com/100"}
              width="100px"
              className="rounded-circle"
              alt="Profile"
            />
            <div>
              <h2>{user?.firstName || "User"}</h2>
              <p>{user?.emailAddresses?.[0]?.emailAddress || "No Email Found"}</p>
            </div>
          </div>

          <h3 className="mb-3">Select Your Role</h3>
          {error && <p className="text-danger fs-5">{error}</p>}
          {success && <p className="text-success fs-5">{success}</p>}
          <div className="d-flex role-radio py-3 justify-content-center">
            <div className="form-check me-4">
              <input
                type="radio"
                name="role"
                value="employer"
                className="form-check-input"
                onChange={onSelectRole}
                id="employer"
              />
              <label htmlFor="employer" className="form-check-label">
                Employer
              </label>
            </div>
            <div className="form-check me-4">
              <input
                type="radio"
                name="role"
                value="jobseeker"
                className="form-check-input"
                onChange={onSelectRole}
                id="jobseeker"
              />
              <label htmlFor="jobseeker" className="form-check-label">
                Job Seeker
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                name="role"
                value="admin"
                className="form-check-input"
                onChange={onSelectRole}
                id="admin"
              />
              <label htmlFor="admin" className="form-check-label">
                Admin
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
