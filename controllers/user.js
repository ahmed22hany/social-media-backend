const jwt = require("jsonwebtoken");
const User = require("../models/user-model"); // Ensure this is properly imported
const secretKey = "CLIENT_SECRET_KEY";

const getUser = async (req, res) => {
  const { token } = req.headers;

  // Check if token is present
  if (!token) {
    return res
      .status(401)
      .json({ ok: false, message: "You are not authorized" });
  }

  try {
    // Verify the token and decode it
    const decodedToken = jwt.verify(token, secretKey); // 'secretKey' should be your actual JWT secret

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Extract user ID from decoded token
    const { id } = decodedToken;

    // Fetch the user from the database using the ID
    const user = await User.findById(id);

    if (user) {
      // If user is found, send the user details
      res.status(200).json({ ok: true, user });
    } else {
      // If user is not found, send 404
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // Catch any errors related to token verification or database issues
    console.error(error);
    return res.status(500).json({ message: "Server error or invalid token" });
  }
};

module.exports = {
  getUser,
};
