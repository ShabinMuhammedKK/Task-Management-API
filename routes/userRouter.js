const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const teamsController = require("../controllers/teamsController")
const { authenticte } = require("../middlewares/middlewares.js");


//here are USER related routes.

router
  .post("/register", userController.registerUser)
  .post("/login", userController.loginUser)
  


  //below are the ejs templates rendering routes.
  //currently not in use.
  
  .get("/user-register", (req, res) => res.render("userRegister"))
  .get("/admin-register", (req, res) => res.render("adminRegister"))
  .get("/login", (req, res) => res.render("login"))
  .get("/admin-home", (req, res) => res.render("admin"))
  .get("/admin-task", (req, res) => res.render("adminTaskManagement"))
  .get("/user-home", (req, res) => res.render("user"))
  .get("/admin-team", (req, res) => res.render("adminTeamManagement"))
  .get("/user-team",authenticte,teamsController.getTeamAndTasks)
  .get("/user-task", (req, res) => res.render("userTask"))
  .get("/user-notifications", (req, res) => res.render("userNotifications"))

module.exports = router;
