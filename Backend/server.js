// Requiring modules ------------
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require('path')

// DB connection ----------------
require("./database");

// APIs router
const allAPIRouter = require('./APIs')

// Setting server ---------------
const app = express();
const PORT = process.env.PORT;

// Middlewares ------------------
app.use(express.json());
app.use(cors({ origin: "*" }));

// Test API ---------------------
app.get("/", (req, res) => {
  return res.send("I am alive !");
});

// Serving images ---------------
app.use("/imageUploads", express.static(path.join(__dirname, "imageUploads")))

// Routing all APIs
app.use('/api', allAPIRouter)

// Starting server --------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});