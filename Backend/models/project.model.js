const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); // Import the mongoose-sequence plugin

const projectSchema = new mongoose.Schema({
  projectId: { 
    type: Number, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user" 
  },
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Completed"],  // Restricting to these values only
    default: "Pending" 
  },
});

// Adding auto-increment functionality to the `projectId`
projectSchema.plugin(AutoIncrement, { inc_field: 'projectId' });

module.exports = mongoose.model("project", projectSchema);

