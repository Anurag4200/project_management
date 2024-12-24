const projectModel = require("../models/project.model");

module.exports.createProjectService = async ({ name, description }) => {
  if (!name || !description) {
    throw new Error("All fields are required");
  }
  const newProject = await new projectModel({
    name,
    description,
  });
  await newProject.save()
  return newProject
};

  
