const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

router.get("/", classController.list); // List all classes
router.get("/new", classController.new); // Show form to create a new class
router.post("/", classController.create); // Create a new class
router.get("/:id", classController.show); // Show a specific class
router.get("/:id/edit", classController.edit); // Show form to edit a class
router.put("/:id", classController.update); // Update a class
router.delete("/:id", classController.delete); // Delete a class

module.exports = router;
