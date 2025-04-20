const pool = require("../db/pool");

exports.list = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, m.name AS manufacturer_name, cl.name AS class_name
      FROM cars c
      JOIN manufacturers m ON c.manufacturer_id = m.id
      JOIN classes cl ON c.class_id = cl.id
    `);
    res.render("cars/list", { cars: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.show = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send("Invalid car ID");
    }
    const result = await pool.query(
      `
      SELECT c.*, m.name AS manufacturer_name, cl.name AS class_name
      FROM cars c
      JOIN manufacturers m ON c.manufacturer_id = m.id
      JOIN classes cl ON c.class_id = cl.id
      WHERE c.id = $1
    `,
      [id]
    );
    const car = result.rows[0];
    if (!car) return res.status(404).send("Car not found");
    res.render("cars/show", { car });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.new = async (req, res) => {
  try {
    const [manufacturersResult, classesResult] = await Promise.all([
      pool.query("SELECT * FROM manufacturers"),
      pool.query("SELECT * FROM classes"),
    ]);
    res.render("cars/new", {
      manufacturers: manufacturersResult.rows,
      classes: classesResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.create = async (req, res) => {
  try {
    const {
      name,
      description,
      top_speed,
      acceleration,
      manufacturer_id,
      class_id,
      price,
      lap_time,
      seats,
      drivetrain,
    } = req.body;
    await pool.query(
      "INSERT INTO cars (name, description, top_speed, acceleration, manufacturer_id, class_id, price, lap_time, seats, drivetrain) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        name,
        description,
        top_speed,
        acceleration,
        manufacturer_id,
        class_id,
        price,
        lap_time,
        seats,
        drivetrain,
      ]
    );
    res.redirect("/cars");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.edit = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send("Invalid car ID");
    }
    const [carResult, manufacturersResult, classesResult] = await Promise.all([
      pool.query("SELECT * FROM cars WHERE id = $1", [id]),
      pool.query("SELECT * FROM manufacturers"),
      pool.query("SELECT * FROM classes"),
    ]);
    const car = carResult.rows[0];
    if (!car) return res.status(404).send("Car not found");
    res.render("cars/edit", {
      car,
      manufacturers: manufacturersResult.rows,
      classes: classesResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.update = async (req, res) => {
  try {
    const {
      name,
      description,
      top_speed,
      acceleration,
      manufacturer_id,
      class_id,
      price,
      lap_time,
      seats,
      drivetrain,
    } = req.body;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send("Invalid car ID");
    }
    await pool.query(
      "UPDATE cars SET name = $1, description = $2, top_speed = $3, acceleration = $4, manufacturer_id = $5, class_id = $6, price = $7, lap_time = $8, seats = $9, drivetrain = $10 WHERE id = $11",
      [
        name,
        description,
        top_speed,
        acceleration,
        manufacturer_id,
        class_id,
        price,
        lap_time,
        seats,
        drivetrain,
        id,
      ]
    );
    res.redirect("/cars");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send("Invalid car ID");
    }
    await pool.query("DELETE FROM cars WHERE id = $1", [id]);
    res.redirect("/cars");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
