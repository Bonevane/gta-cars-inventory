// app.js
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");

const manufacturersRoutes = require("./routes/manufacturers");
const classesRoutes = require("./routes/classes");
const carsRoutes = require("./routes/cars");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));

// Route mounting
app.use("/manufacturers", manufacturersRoutes);
app.use("/classes", classesRoutes);
app.use("/cars", carsRoutes);
app.use((err, req, res, next) => {
  console.error("Error occurred:", err); // Log the error to the console

  const statusCode = err.status || 500; // Default to 500 if no status is provided
  const errorMessage = err.message || "Internal Server Error"; // Default message

  // Render error.ejs with the error message and status code
  res.status(statusCode).render("partials/error", {
    error: {
      message: errorMessage,
      status: statusCode,
    },
  });
});

// Home redirect
app.get("/", (req, res) => res.redirect("/manufacturers"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
