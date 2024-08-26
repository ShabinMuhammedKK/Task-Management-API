const Task = require("../models/taskModel");
const Team = require("../models/teamsModel");
const User = require("../models/userModel");





//task creation according to user or to the team

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, assignedToModel, dueDate } =
      req.body;
    if (!title || !description || !assignedTo || !assignedToModel) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!["user", "team"].includes(assignedToModel)) {
      return res
        .status(400)
        .json({ message: "Invalid assingnedToModal value" });
    }
    if (assignedToModel === "user") {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res
          .status(400)
          .json({ message: "Assingned user does not exist" });
      }
    } else if (assignedToModel === "team") {
      const teamExists = await Team.findById(assignedTo);
      if (!teamExists) {
        return res
          .status(400)
          .json({ message: "Assingned team does not exist" });
      }
    }

    const newTask = new Task({
      title,
      description,
      assignedTo,
      assignedToModel,
      createdBy: req.user._id,
      dueDate,
    });

    await newTask.save();

    if (assignedToModel === "user") {
      await User.findOneAndUpdate(
        { _id: assignedTo },
        { $addToSet: { tasks: newTask._id } }
      );
    }
    if (assignedToModel === "team") {
      await Team.findOneAndUpdate(
        { _id: assignedTo },
        { $addToSet: { tasks: newTask._id } }
      );
    }

    req.io.emit('taskCreated', {
      message: 'A new task has been created',
      task: newTask,
    });

    return res
      .status(200)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.log("Error creating task", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};





//fetching the tasks

const getTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({ message: "Task id required" });
    }
    const isExistingTask = await Task.findById(taskId);
    if (!isExistingTask) {
      return res.status(400).json({ message: "Task does not exist" });
    }

    req.io.emit('taskFetched', {
      message: 'Task fetched successfully',
      task: isExistingTask
    });

    return res
      .status(200)
      .json({ message: "Task fetched successfully", taskData: isExistingTask });
  } catch (error) {
    console.log("Error fetching task", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




//updating the task by the admin with admin authorisation

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { description, status } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: "Task id required" });
    }
    if (!description || !status) {
      return res
        .status(400)
        .json({ message: "Task description and status required" });
    }

    const isExistingTask = await Task.findById(taskId);
    if (!isExistingTask) {
      return res.status(400).json({ message: "Task does not exist" });
    }
    if (status && description) {
      isExistingTask.status = status;
      isExistingTask.description = description;
    }
    await isExistingTask.save();

    req.io.emit('taskUpdated', {
      message: 'Task updated successfully',
      task: isExistingTask
    });

    return res
      .status(200)
      .json({ message: "Task updated successfully", taskData: isExistingTask });
  } catch (error) {
    console.log("Error updating task", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




//deleting the task by the admin with adming authorisation

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({ message: "Task id required" });
    }
    const isExistingTask = await Task.findById(taskId);
    if (!isExistingTask) {
      return res.status(400).json({ message: "Task for this id not found" });
    }

    await User.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });
    await Team.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });
    await Task.findByIdAndDelete(taskId);


    req.io.emit('taskDeleted', {
      message: 'Task deleted successfully',
      taskId: taskId
    });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("Error deleting task", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};





//here updating tasks progress by the users or by the team ,this is done by user withe
// the data status that only sharing here becuase of the user operations

const updateTaskProgress = async (req, res) => {
  try {
    const taskId = req.params.id;
    const {status } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: "Task id required" });
    }
    if (!status) {
      return res
        .status(400)
        .json({ message: "Task status required" });
    }

    const isExistingTask = await Task.findById(taskId);
    if (!isExistingTask) {
      return res.status(400).json({ message: "Task does not exist" });
    }
    if (status) {
      isExistingTask.status = status;
    }
    await isExistingTask.save();


    req.io.emit('taskUpdated', {
      message: "Task progress updated successfully",
      taskData: isExistingTask
    });

    return res
      .status(200)
      .json({ message: "Task progress updated successfully", taskData: isExistingTask });
  } catch (error) {
    console.log("Error updating task", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  updateTaskProgress
};
