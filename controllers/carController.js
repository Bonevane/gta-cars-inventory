const db = require("../db/pool");

const countryCodeMap = {
  USA: "us",
  Germany: "de",
  Japan: "jp",
  UK: "gb",
  Italy: "it",
  France: "fr",
};

module.exports = countryCodeMap;

module.exports = {
  async list(req, res, next) {
    try {
      const carRes = await db.query(
        `  SELECT 
            cars.*, 
            classes.name AS class_name, 
            manufacturers.name AS manufacturer_name,
            manufacturers.country AS country
          FROM cars
          JOIN classes ON cars.class_id = classes.id
          JOIN manufacturers ON cars.manufacturer_id = manufacturers.id
          ORDER BY cars.model
        `
      );

      const manufacturerRes = await db.query(
        `SELECT id, name FROM manufacturers ORDER BY name`
      );
      const classRes = await db.query(
        `SELECT id, name FROM classes ORDER BY name`
      );

      carRes.rows.forEach((car) => {
        car.country = countryCodeMap[car.country] || "xx";
      });

      res.render("cars/index", {
        cars: carRes.rows,
        manufacturers: manufacturerRes.rows,
        classes: classRes.rows,
      });
    } catch (err) {
      console.error(err);
      const error = new Error("Error loading cars");
      error.status = 500;
      next(error);
    }
  },

  newForm(req, res, next) {
    // Need manufacturers + classes for dropdowns
    Promise.all([
      db.query("SELECT id, name FROM manufacturers ORDER BY name"),
      db.query("SELECT id, name FROM classes ORDER BY name"),
    ])
      .then(([mRes, cRes]) => {
        res.render("cars/form", {
          car: {},
          manufacturers: mRes.rows,
          classes: cRes.rows,
          action: "/cars",
        });
      })
      .catch(next);
  },

  async create(req, res, next) {
    const {
      model,
      manufacturer_id,
      class_id,
      price,
      image_url,
      engine_power,
      weight,
      doors,
      drive_type,
      lap_time,
      top_speed,
      drag_coefficient,
      brake_force,
    } = req.body;
    try {
      await db.query(
        `INSERT INTO cars
         (model, manufacturer_id, class_id, price, image_url,
          engine_power, weight, doors, drive_type, lap_time,
          top_speed, drag_coefficient, brake_force)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          model,
          manufacturer_id,
          class_id,
          price,
          image_url,
          engine_power,
          weight,
          doors,
          drive_type,
          lap_time,
          top_speed,
          drag_coefficient,
          brake_force,
        ]
      );
      res.redirect("/cars"); // or to cars list
    } catch (err) {
      next(err);
    }
  },

  // JSON for popup
  async showJSON(req, res, next) {
    try {
      const { id } = req.params;
      const { rows } = await db.query(
        `SELECT cars.*, manufacturers.name AS man_name, classes.name AS class_name, manufacturers.country AS country
         FROM cars
         JOIN manufacturers ON cars.manufacturer_id=manufacturers.id
         JOIN classes       ON cars.class_id=classes.id
         WHERE cars.id=$1`,
        [id]
      );
      if (!rows.length) return res.status(404).json({ error: "Not found" });

      rows[0].country = countryCodeMap[rows[0].country] || "xx";

      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  },

  async editForm(req, res, next) {
    try {
      const { id } = req.params;

      // Get the car details
      const carResult = await db.query("SELECT * FROM cars WHERE id = $1", [
        id,
      ]);
      if (carResult.rows.length === 0) {
        return res.status(404).send("Car not found");
      }
      const car = carResult.rows[0];

      // Get class and manufacturer options for the dropdowns
      const classes = (await db.query("SELECT * FROM classes")).rows;
      const manufacturers = (await db.query("SELECT * FROM manufacturers"))
        .rows;

      res.render("cars/form", {
        car,
        classes,
        manufacturers,
        formAction: `/cars/${id}?_method=PUT`,
        method: "PUT",
        buttonLabel: "Update Car",
      });
    } catch (err) {
      const error = new Error("Error loading form");
      error.status = 500;
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const {
        model,
        manufacturer_id,
        class_id,
        price,
        image_url,
        engine_power,
        weight,
        doors,
        drive_type,
        lap_time,
        top_speed,
        drag_coefficient,
        brake_force,
      } = req.body;

      await db.query(
        `
        UPDATE cars SET
          model = $1,
          manufacturer_id = $2,
          class_id = $3,
          price = $4,
          image_url = $5,
          engine_power = $6,
          weight = $7,
          doors = $8,
          drive_type = $9,
          lap_time = $10,
          top_speed = $11,
          drag_coefficient = $12,
          brake_force = $13
        WHERE id = $14
      `,
        [
          model,
          manufacturer_id,
          class_id,
          price,
          image_url,
          engine_power,
          weight,
          doors,
          drive_type,
          lap_time,
          top_speed,
          drag_coefficient,
          brake_force,
          id,
        ]
      );

      res.redirect("/cars");
    } catch (err) {
      const error = new Error("Error updating car");
      error.status = 500;
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      await db.query("DELETE FROM cars WHERE id=$1", [id]);
      res.redirect("/cars");
    } catch (err) {
      next(err);
    }
  },
};
