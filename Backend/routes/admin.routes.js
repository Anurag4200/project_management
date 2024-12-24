const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin.controllers');
const { isAdmin } = require('../middleware/isAdmin'); // Import the isAdmin middleware


router.post("/login",adminControllers.adminLogin)
router.get("/logout",isAdmin,adminControllers.adminLogout)
router.post("/create",isAdmin, adminControllers.createProject)
// Admin route to assign a project to a user
router.put('/projects/:projectId/assign/:userId', isAdmin, adminControllers.assignProjectToUser);

// Admin route to get all users
router.get('/users', isAdmin, adminControllers.getAllUsers);

// Admin route to get all projects
router.get('/projects', isAdmin, adminControllers.getAllProjects);

// Admin route to delete a project
router.delete('/projects/:projectId', isAdmin, adminControllers.deleteProject);

module.exports = router;
