//set this up as a controller file
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please sign in." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    // Create a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    
    // Store JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // Ensures the cookie is only accessible by the server
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
    });

    // Respond with a success message
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Login an existing user and set JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Store JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // Ensures the cookie is only accessible by the server
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Protected Route
exports.getUserDetails = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, please log in" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};
