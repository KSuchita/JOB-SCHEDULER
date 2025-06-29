const Employer = require("../models/employerModel");
const JobSeeker = require("../models/jobSeekerModel");
const Admin = require("../models/adminModel");

async function createEmpOrJobOrAdmin(req, res) {
  const validRoles = ["Employer", "JobSeeker", "Admin"];
  const { role, email, password, action } = req.body; // action can be 'create' or 'login'

  // Validate email
  if (!email) {
    return res.status(400).send({ message: "Email is required." });
  }

  // If action is 'login', validate password as well
  if (action === "login" && !password) {
    return res.status(400).send({ message: "Password is required for login." });
  }

  // Validate role if it's provided
  if (role && !validRoles.includes(role)) {
    return res.status(400).send({ message: "Invalid role specified." });
  }

  try {
    // Handle login action
    if (action === "login") {
      let user;

      // Find the user based on the email and role
      switch (role) {
        case "Employer":
          user = await Employer.findOne({ email });
          break;
        case "JobSeeker":
          user = await JobSeeker.findOne({ email });
          break;
        case "Admin":
          user = await Admin.findOne({ email });
          break;
        default:
          return res.status(400).send({ message: "Invalid role specified." });
      }

      // If no user is found for that role and email, return error
      if (!user) {
        return res.status(404).send({ message: `No user found with the role: ${role} for the provided email.` });
      }

      // If user exists but role does not match, deny login
      if (user.role !== role) {
        return res.status(400).send({
          message: `You are registered as a ${user.role}. Please log in with the correct role.`,
        });
      }

      // Validate password (assuming bcrypt is being used)
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(400).send({ message: "Incorrect password." });
      }

      // Successful login
      return res.status(200).send({
        message: `${role} logged in successfully.`,
        payload: user,
      });
    }

    // Handle create action
    if (action === "create") {
      // Check if the user already exists in any role (Employer, JobSeeker, Admin)
      const existingEmployer = await Employer.findOne({ email });
      const existingJobSeeker = await JobSeeker.findOne({ email });
      const existingAdmin = await Admin.findOne({ email });

      // If a user already exists with the given email, prevent changing their role
      if (existingEmployer || existingJobSeeker || existingAdmin) {
        const existingRole = existingEmployer
          ? "Employer"
          : existingJobSeeker
          ? "JobSeeker"
          : "Admin";

        // Prevent role change after registration
        if (role && existingRole !== role) {
          return res.status(400).send({
            message: `Role change not allowed. You are already registered as: ${existingRole}.`,
          });
        }

        // Return existing user if already registered
        const existingUser = existingEmployer || existingJobSeeker || existingAdmin;
        return res.status(200).send({
          message: `User already exists with role: ${existingRole}.`,
          payload: existingUser,
        });
      }

      // Require a role for new users
      if (!role) {
        return res.status(400).send({
          message: "Role is required. Please select a valid role to continue.",
        });
      }

      // Create a new user based on the role
      let newUser;
      switch (role) {
        case "Employer":
          newUser = new Employer(req.body);
          break;
        case "JobSeeker":
          newUser = new JobSeeker(req.body);
          break;
        case "Admin":
          newUser = new Admin(req.body);
          break;
        default:
          return res.status(400).send({ message: "Unexpected error with the role." });
      }

      // Save the new user in the database
      const savedEntity = await newUser.save();
      return res.status(201).send({
        message: `${savedEntity.role} created successfully.`,
        payload: savedEntity,
      });
    }

    return res.status(400).send({ message: "Invalid action specified." });
  } catch (err) {
    console.error("Error in createEmpOrJobOrAdmin:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation failed. Please ensure all required fields are provided.",
        errors: err.errors,
      });
    }

    return res.status(500).send({
      message: "An internal server error occurred while processing your request.",
    });
  }
}

module.exports = createEmpOrJobOrAdmin;
