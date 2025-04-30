const db = require("../db/pool");

module.exports = {
  async list(req, res, next) {
    try {
      const { rows } = await db.query("SELECT * FROM classes ORDER BY name");
      res.render("classes/index", { classes: rows });
    } catch (err) {
      next(err);
    }
  },

  newForm(req, res) {
    res.render("classes/form", { cls: {}, action: "/" });
  },

  async create(req, res, next) {
    const { name, description } = req.body;
    try {
      await db.query("INSERT INTO classes (name, description) VALUES ($1,$2)", [
        name,
        description,
      ]);
      res.redirect("/classes");
    } catch (err) {
      next(err);
    }
  },

  async show(req, res, next) {
    try {
      const { id } = req.params;
      const classRes = await db.query("SELECT * FROM classes WHERE id=$1", [
        id,
      ]);
      const carsRes = await db.query(
        "SELECT * FROM cars WHERE class_id=$1 ORDER BY model",
        [id]
      );

      if (!classRes.rows.length) return res.status(404).send("Not found");
      res.render("classes/show", {
        carClass: classRes.rows[0],
        cars: carsRes.rows,
      });
    } catch (err) {
      next(err);
    }
  },

  async editForm(req, res, next) {
    try {
      const { id } = req.params;
      const { rows } = await db.query("SELECT * FROM classes WHERE id=$1", [
        id,
      ]);
      if (!rows.length) return res.status(404).send("Not found");
      res.render("classes/form", {
        cls: rows[0],
        action: `/classes/${id}?_method=PUT`,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      await db.query("UPDATE classes SET name=$1, description=$2 WHERE id=$3", [
        name,
        description,
        id,
      ]);
      res.redirect(`/classes/${id}`);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      await db.query("DELETE FROM classes WHERE id=$1", [id]);
      res.redirect("/classes");
    } catch (err) {
      const error = new Error("Cannot delete class with cars");
      error.status = 400;
      next(error);
    }
  },
};
