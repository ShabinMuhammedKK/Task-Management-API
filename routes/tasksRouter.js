const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/taskController");
const { authenticte, authorize } = require("../middlewares/middlewares");


//here all TASK related routers with implementing
//private routes and verifying admin aceess through "authorize("admin")".

router
  .post("/create", authenticte, authorize("admin"), tasksController.createTask)
  .get("/:id", authenticte, tasksController.getTask)
  .put("/update/:id",authenticte,authorize("admin"),tasksController.updateTask)
  .delete("/delete/:id",authenticte,authorize("admin"),tasksController.deleteTask)
  .put("/update-status/:id", authenticte, tasksController.updateTaskProgress);

module.exports = router;
