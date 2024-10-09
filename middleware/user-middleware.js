const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const protectRoute = async (req, res, next) => {
  try {
    // Check if token exists in cookies
    const token = req.headers.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify token and decode the user ID
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");

    // Fetch the user from the database, excluding the password field
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    // Continue to the next middleware
    next();
  } catch (err) {
    // Check for specific JWT error types
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    // Generic error response for other issues
    console.error("Error in protectRoute middleware:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { protectRoute };
