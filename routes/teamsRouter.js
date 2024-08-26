const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController");
const { authenticte, authorize } = require("../middlewares/middlewares");




//here TEAM related routes,with middlewares for protected routes.

router
  .post("/create", authenticte, authorize("admin"), teamsController.createTeam)
  .get("/:id", authenticte, teamsController.getTeamAndTasks)
  .get("/all-users", authenticte, teamsController.getAllUsers);

module.exports = router;
