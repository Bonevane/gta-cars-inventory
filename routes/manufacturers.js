const express = require("express");
const router = express.Router();
const ctl = require("../controllers/manufacturerController");

router.get("/", ctl.list);
router.get("/new", ctl.newForm);
router.post("/", ctl.create);
router.get("/:id", ctl.show);
router.get("/:id/edit", ctl.editForm);
router.put("/:id", ctl.update);
router.delete("/:id", ctl.remove);

module.exports = router;
