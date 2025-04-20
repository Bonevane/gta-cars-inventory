const express = require("express");
const router = express.Router();
const manufacturerController = require("../controllers/manufacturerController");

router.get("/", manufacturerController.list); // List all manufacturers
router.get("/new", manufacturerController.new); // Show form to create a new manufacturer
router.post("/", manufacturerController.create); // Create a new manufacturer
router.get("/:id", manufacturerController.show); // Show a specific manufacturer
router.get("/:id/edit", manufacturerController.edit); // Show form to edit a manufacturer
router.put("/:id", manufacturerController.update); // Update a manufacturer
router.delete("/:id", manufacturerController.delete); // Delete a manufacturer

module.exports = router;
