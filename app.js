const express = require("express");
const methodOverride = require("method-override");
const homeController = require("./controllers/homeController");
const manufacturerRoutes = require("./routes/manufacturers");
const classRoutes = require("./routes/classes");
const carRoutes = require("./routes/cars");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", homeController.index);

app.use("/manufacturers", manufacturerRoutes);
app.use("/classes", classRoutes);
app.use("/cars", carRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
