const mongoose = require("mongoose");

function connectToDb() {
  try {
    mongoose
    .connect("mongodb://127.0.0.1:27017/Project_management")
    .then(() => {
      console.log("Database is connected");
    })
  } catch (error) {
    console.log(error)
  }
}


module.exports=connectToDb;

