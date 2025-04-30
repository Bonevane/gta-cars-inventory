const db = require("../db/pool");

module.exports = {
  // List all manufacturers
  async list(req, res, next) {
    try {
      const { rows: manufacturers } = await db.query(
        "SELECT * FROM manufacturers ORDER BY name"
      );
      res.render("manufacturers/index", { manufacturers });
    } catch (err) {
      next(err);
    }
  },

  // Show form to create new
  newForm(req, res) {
    res.render("manufacturers/form", { manufacturer: {}, action: "/" });
  },

  // Create new
  async create(req, res, next) {
    const { name, country, logo_url } = req.body;
    try {
      await db.query(
        "INSERT INTO manufacturers (name, country, logo_url) VALUES ($1,$2,$3)",
        [name, country, logo_url]
      );
      res.redirect("/manufacturers");
    } catch (err) {
      next(err);
    }
  },

  // Show details + related cars
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const mRes = await db.query("SELECT * FROM manufacturers WHERE id=$1", [
        id,
      ]);
      const cRes = await db.query(
        "SELECT * FROM cars WHERE manufacturer_id=$1 ORDER BY model",
        [id]
      );
      if (!mRes.rows.length) return res.status(404).send("Not found");
      res.render("manufacturers/show", {
        manufacturer: mRes.rows[0],
        cars: cRes.rows,
      });
    } catch (err) {
      next(err);
    }
  },

  // Show edit form
  async editForm(req, res, next) {
    try {
      const { id } = req.params;
      const { rows } = await db.query(
        "SELECT * FROM manufacturers WHERE id=$1",
        [id]
      );
      if (!rows.length) return res.status(404).send("Not found");
      res.render("manufacturers/form", {
        manufacturer: rows[0],
        action: `/manufacturers/${id}?_method=PUT`,
      });
    } catch (err) {
      next(err);
    }
  },

  // Update
  async update(req, res, next) {
    const { id } = req.params;
    const { name, country, logo_url } = req.body;
    try {
      await db.query(
        "UPDATE manufacturers SET name=$1, country=$2, logo_url=$3 WHERE id=$4",
        [name, country, logo_url, id]
      );
      res.redirect(`/manufacturers/${id}`);
    } catch (err) {
      next(err);
    }
  },

  // Delete
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      await db.query("DELETE FROM manufacturers WHERE id=$1", [id]);
      res.redirect("/manufacturers");
    } catch (err) {
      const error = new Error("Cannot delete manufacturer with cars");
      error.status = 400;
      next(error);
    }
  },
};
