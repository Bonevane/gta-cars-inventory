const pool = require("../db/pool");

exports.index = async (req, res) => {
  try {
    // Fetch summary data (e.g., total cars)
    const carCountResult = await pool.query(
      "SELECT COUNT(*) AS count FROM cars"
    );
    const carCount = carCountResult.rows[0].count;

    res.render("home/index", { carCount });
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};
