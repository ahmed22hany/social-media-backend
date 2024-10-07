const jwt = require("jsonwebtoken");
const User = require("../models/user-model"); // Ensure this is properly imported
const secretKey = "CLIENT_SECRET_KEY";
const mongoose = require("mongoose");

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

const updateUser = async (req, res) => {
  const { name, email, username, password, profilePic, bio } = req.body;
  const { id } = req.params;

  console.log("Request Params ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    let user = await User.findById(id);

    if (!user) return res.status(400).json({ message: "User not found" });

    if (id !== user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot update other user's profile" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    await user.save();

    console.log("Updated User:", user);

    res.status(200).json(user);
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({ message: "Error updating user!", error: err.message });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    return res.status(200).json({message: `User deleted successfully ${deletedUser.username}` });

  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({ message: "Error deleting User!", error: err.message });
  }
};
module.exports = {
  getUser,
  updateUser,
  deleteUser
};
