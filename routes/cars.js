const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

router.get("/", carController.list);
router.get("/new", carController.new);
router.post("/", carController.create);
router.get("/:id", carController.show);
router.get("/:id/edit", carController.edit);
router.put("/:id", carController.update);
router.delete("/:id", carController.delete);

module.exports = router;
