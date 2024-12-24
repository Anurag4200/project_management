const express=require("express")
const router= express.Router()
const projectControllers= require("../controllers/project.controllers")

router.get("/create", projectControllers.createProject)
// router.delete("/delete/:id", projectControllers.deleteProject);






module.exports=router