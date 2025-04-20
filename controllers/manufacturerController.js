const pool = require("../db/pool");

exports.list = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM manufacturers");
    res.render("manufacturers/list", { manufacturers: result.rows });
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.show = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM manufacturers WHERE id = $1",
      [req.params.id]
    );
    const manufacturer = result.rows[0];
    if (!manufacturer) return res.send("Manufacturer not found");
    res.render("manufacturers/show", { manufacturer });
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.new = async (req, res) => {
  res.render("manufacturers/new");
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    await pool.query("INSERT INTO manufacturers (name) VALUES ($1)", [name]);
    res.redirect("/manufacturers");
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.edit = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM manufacturers WHERE id = $1",
      [req.params.id]
    );
    const manufacturer = result.rows[0];
    if (!manufacturer) return res.send("Manufacturer not found");
    res.render("manufacturers/edit", { manufacturer });
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    await pool.query("UPDATE manufacturers SET name = $1 WHERE id = $2", [
      name,
      req.params.id,
    ]);
    res.redirect("/manufacturers");
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.delete = async (req, res) => {
  try {
    await pool.query("DELETE FROM manufacturers WHERE id = $1", [
      req.params.id,
    ]);
    res.redirect("/manufacturers");
  } catch (err) {
    if (err.code === "23503") {
      res.send(
        "Cannot delete manufacturer because there are cars associated with it."
      );
    } else {
      console.error(err);
      res.send("Error");
    }
  }
};
