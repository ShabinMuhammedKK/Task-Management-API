const { mongoose } = require("mongoose");
const Team = require("../models/teamsModel");
const User = require("../models/userModel");
const Task = require("../models/taskModel");





//here implemented the function to get all users data to use make the team by
// the user`s id in an array

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    if (!allUsers) {
      return res.status(400).json({ message: "Users not found" });
    }

    req.io.emit('usersUpdated', {
      message: "Users list updated successfully",
      users: allUsers
    });


    return res
      .status(200)
      .json({ message: "Got users successfully", allUsers });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};




//here is the team creation take place

const createTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    if (!name || !members || !Array.isArray(members)) {
      return res
        .status(400)
        .json({ message: "Please provide valid team details" });
    }
    const isExistingTeam = await Team.findOne({ name });
    if (isExistingTeam) {
      return res
        .status(400)
        .json({ message: "This is team is already registered" });
    }
    const users = await User.find({ _id: { $in: members } });
    if (users.length !== members.length) {
      return res.status(400).json({ message: "Some users are not exist" });
    }
    const newTeam = new Team({
      name,
      description: description || "",
      members,
    });

    await newTeam.save();

    await User.updateMany(
      { _id: { $in: members } },
      { $addToSet: { teams: newTeam._id } }
    );


    req.io.emit('teamCreated', {
      message: "New team created successfully",
      team: newTeam
    });

    return res
      .status(200)
      .json({ message: "New team created successfully", newTeam });
  } catch (error) {
    console.log("Error creating team", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




//here is the function to show or list the task according to the memebers who joined teams
//this for listing in the client side

const getTeamAndTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User id not found" });
    }
    const isExistingUser = await User.findById(userId);
    if (!isExistingUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const userTeams = isExistingUser.teams;

    const objectIds = userTeams.map((id) => new mongoose.Types.ObjectId(id));
    const teams = await Team.find({ _id: { $in: objectIds } });

    const allTasks = teams.reduce((acc, team) => {
      return acc.concat(team.tasks);
    }, []);

    const teamsTasks = await Task.find({_id:{$in:allTasks}});

    
    req.io.emit('teamAndTasksFetched', {
      message: "Teams and tasks data fetched successfully",
      teamsTasks,
      teams
    });

    return res.status(200).json({ message: "got teams tasks details", teamsTasks,teams });
  } catch (error) {
    console.log("Error fetching team data", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTeam,
  getTeamAndTasks,
  getAllUsers,
};
