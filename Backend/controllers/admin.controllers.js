const User = require("../models/user.model");
const Project = require("../models/project.model");
const projectServices = require("../services/project.service"); // Import the project services if needed
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Controller to assign a project to a user
module.exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied, admin only" });
    }
    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key (stored in .env)
      { expiresIn: "24h" } 
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // Set a cookie with JWT
    // Return the JWT token in the response
    res.status(200).json({
      msg: "Login successful",
      token,
      user,
    });
  } catch (error) {
    next(error); 
  }
};
module.exports.adminLogout = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  res.cookie("token", "");
  res.status(201).json({ msg: "admin logout successfuly" });
};
module.exports.createProject = async (req, res, next) => {
  const { name, description } = req.body;
  const isProjectExist = await Project.findOne({ name });
  if (isProjectExist) {
    return res.status(400).json({ msg: "Project name already taken" });
  }

  const project = await projectServices.createProjectService({
    name: name,
    description: description,
  });
  res.status(200).json({ msg: "project created successfully", project });
};

module.exports.assignProjectToUser = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params;

    // Find the project and the user
    const project = await Project.findOne({ _id: projectId });
    const user = await User.findOne({ _id: userId });
    console.log(user);

    if (!project || !user) {
      return res.status(404).json({ msg: "Project or User not found" });
    }
    // Check if the project is already assigned to someone
    if (project.assignedTo) {
      return res
        .status(400)
        .json({ msg: "This project is already assigned to another user" });
    }

    // Assign the project to the user
    user.projects.push(project._id);
    await user.save();

 
    project.assignedTo = user._id;
    await project.save();

    res.status(200).json({ msg: "Project assigned successfully", project });
  } catch (error) {
    next(error); 
  }
};

// Controller to view all users
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }); // Filter users whose role is not 'admin'
    res.status(200).json({ users });
  } catch (error) {
    next(error); // Pass the error to error-handling middleware
  }
};

// Controller to view all projects
module.exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ projects });
  } catch (error) {
    next(error); // Pass the error to error-handling middleware
  }
};

// Controller to delete a project
module.exports.deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

  
    const project = await Project.findOneAndDelete({ _id: projectId });

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.status(200).json({ msg: "Project deleted successfully", project });
  } catch (error) {
    next(error); 
  }
};
