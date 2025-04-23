// routes/cars.js
const express = require("express");
const router = express.Router();
const ctl = require("../controllers/carController");

router.get("/", ctl.list);
router.get("/new", ctl.newForm);
router.post("/", ctl.create);
router.get("/:id", ctl.showJSON); // returns JSON for popup
router.get("/:id/edit", ctl.editForm);
router.put("/:id", ctl.update);
router.delete("/:id", ctl.remove);

module.exports = router;
