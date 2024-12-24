import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAdminAuth } from "../../context/AdminAuthContext";
import Cookies from 'js-cookie';

const AdminDashboard = () => {
  const [authAdminToken,setAuthAdminToken]=useAdminAuth()
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/users", {
        withCredentials: true,
      });
      console.log(response.data.users);

      setUsers(response.data.users);

      // Assuming response.data is an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/projects", {
        withCredentials: true,
      });

      setProjects(response.data.projects);
      console.log(response.data.projects); // Assuming response.data is an array of projects
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  // Create a new project
  const createProject = async () => {
    try {
      const newProject = {
        name: newProjectName,
        description: newProjectDescription,
      };
      const response = await axios.post(
        "http://localhost:3000/admin/create",
        newProject,
        { withCredentials: true }
      );
      setProjects([...projects, response.data]);
      setNewProjectName("");
      setNewProjectDescription("");
      window.location.reload();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`http://localhost:3000/admin/projects/${projectId}`, {
        withCredentials: true,
      });
      setProjects(projects.filter((project) => project._id !== projectId));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Assign project to a user
  const assignProjectToUser = async (projectId, userId) => {
    try {
      await axios.put(
        `http://localhost:3000/admin/projects/${projectId}/assign/${userId}`,
        {},
        { withCredentials: true }
      );
      setProjects(
        projects.map((project) =>
          project._id === projectId
            ? { ...project, assignedTo: userId }
            : project
        )
      );
    } catch (error) {
      console.error("Error assigning project:", error);
    }
  };

  const handleLogout=async()=>{
    try {
      localStorage.removeItem('admin-token')
      setAuthAdminToken(null)
      Cookies.remove('token') 

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Admin Dashboard
          </h2>
           {/* Logout Button */}
           <div className="text-right mb-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Users</h3>

            <ul className="space-y-2 mt-4">
              {users.map((user, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-4 border border-gray-300 rounded-md shadow-sm"
                >
                  <div className="flex items-center">
                    <span className="text-lg">{user.email}</span>
                    <span className="ml-4 text-sm text-gray-500">
                      Role: {user.role}
                    </span>
                    <span className="ml-4 text-sm text-gray-600 font-medium">
                      ID: {user._id}
                    </span>
                  </div>

                  {/* Dropdown for changing role */}
                  <select
                    value={user.role}
                    onChange={(e) => changeUserRole(user.id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="Frontend Developer">
                      Frontend Developer
                    </option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">
                      Full Stack Developer
                    </option>
                    <option value="Blockchain Expert">Blockchain Expert</option>
                  </select>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold">Projects</h3>
            <div className="mt-4 mb-4">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="New project name"
                className="p-2 border border-gray-300 rounded-md mb-2 w-full"
              />
              <textarea
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Project description"
                className="p-2 border border-gray-300 rounded-md mb-2 w-full"
              />
              <button
                onClick={createProject}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                Create Project
              </button>
            </div>
            <div className="mt-4 mb-4">
              <h4 className="text-lg font-medium">Assign Project to User</h4>
              <select
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                }}
                className="p-2 border border-gray-300 rounded-md w-full mb-4"
              >
                <option value="">Select a user</option>
                {users.map((user, index) => (
                  <option key={index} value={user._id}>
                    {user.email}
                  </option>
                ))}
              </select>
              <ul className="space-y-2">
                {projects.map((project, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 border border-gray-300 rounded-md shadow-sm"
                  >
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-500">
                        {project.description}
                      </p>
                      {project.assignedTo && (
                        <span className="text-sm text-blue-500">
                          Assigned to User {project.assignedTo}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          assignProjectToUser(project._id, selectedUser)
                        }
                        className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => deleteProject(project._id)}
                        className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
