const projectModel=require("../models/project.model")
const projectServices= require("../services/project.service")

module.exports.createProject=async(req,res,next)=>{
    const {name,description}= req.body
    const isProjectExist= await projectModel.findOne({name})
    if(isProjectExist){
        res.status(400).json({msg:"Project name already taken"})
    }

    const project= await projectServices.createProjectService({
        name:name,
        description:description
    })
    res.status(200).json({msg:"project created successfully",project})
}

// module.exports.deleteProject = async (req, res, next) => {
//     try {
//       const { id } = req.params;  Destructuring the id from params
  
//        Call the service to delete the project by its projectId
//       const deletedProject = await projectServices.deleteProjectService({ id });
  
//       Send a successful response if the project is deleted
//       res.status(200).json({
//         msg: "Project deleted successfully",
//         deletedProject,
//       });
//     } catch (error) {
//       Handle errors and respond with an error message
//       res.status(404).json({ msg: error.message });  // Sends the error message (e.g., "Project not found")
//     }
//   };
  