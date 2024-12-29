// imports
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session")

//generate a new express app
const app = express();

//import dotenv
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//import routes
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

//connect to the database using mongoose and an env variable
mongoose.connect(process.env.MONGODB_URI, {}).then(() => {
  console.log("Connected to the database");
});

//start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
