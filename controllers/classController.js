const pool = require("../db/pool");

exports.list = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM classes");
    res.render("classes/list", { classes: result.rows });
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.show = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM classes WHERE id = $1", [
      req.params.id,
    ]);
    const carClass = result.rows[0];
    if (!carClass) return res.send("Class not found");
    res.render("classes/show", { carClass });
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.new = async (req, res) => {
  res.render("classes/new");
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    await pool.query("INSERT INTO classes (name) VALUES ($1)", [name]);
    res.redirect("/classes");
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.edit = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM classes WHERE id = $1", [
      req.params.id,
    ]);
    const carClass = result.rows[0];
    if (!carClass) return res.send("Class not found");
    res.render("classes/edit", { carClass });
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    await pool.query("UPDATE classes SET name = $1 WHERE id = $2", [
      name,
      req.params.id,
    ]);
    res.redirect("/classes");
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM classes WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.send("Class not found");
    }
    await pool.query("DELETE FROM classes WHERE id = $1", [req.params.id]);
    res.redirect("/classes");
  } catch (err) {
    if (err.code === "23503") {
      res.send(
        "Cannot delete class because there are cars associated with it."
      );
    } else {
      console.error(err);
      res.send("Error");
    }
  }
};
