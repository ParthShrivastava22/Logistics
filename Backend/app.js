const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectToDB = require("./db/db");
const userRoutes = require("./routes/user.routes");
const driverRoutes = require("./routes/driver.routes");
const mapsRoutes = require("./routes/maps.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

connectToDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", userRoutes);
app.use("/drivers", driverRoutes);
app.use("/maps", mapsRoutes);
app.use("/deliveries", deliveryRoutes);

module.exports = app;
