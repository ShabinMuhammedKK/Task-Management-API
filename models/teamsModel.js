const mongoose = require("mongoose");
const Task = require("./taskModel");
var Schema = mongoose.Schema;

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default:"",
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
},{
    timestamps:true,
});

const Team = mongoose.model("Team",teamSchema);
module.exports = Team;
