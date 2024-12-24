const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Retrieve token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, please log in" });
  }

  try {
    // Verify token and decode the user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
