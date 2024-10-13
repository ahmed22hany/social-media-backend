const jwt = require("jsonwebtoken");
const User = require("../models/user-model"); // Ensure this is properly imported
const Post = require("../models/post-model");
const secretKey = "CLIENT_SECRET_KEY";
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const getUser = async (req, res) => {
  const { id } = req.params;

  // Check if the userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    // Fetch the user from the database using the provided userId
    const user = await User.findById(id);

    if (user) {
      // Fetch the posts created by the user, populate necessary fields
      const posts = await Post.find({ postedBy: user._id })
        .populate("postedBy", "username profilePic") // Populate postedBy with username and profilePic
        .populate("likes", "username") // Populate likes with username
        .populate("replies", "username profilePic"); // Populate replies with user details

      // Return the user details and their posts
      return res.status(200).json({ ok: true, user, posts });
    } else {
      // If user is not found, return a 404 error
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAuthUser = async (req, res) => {
  const { token } = req.headers;

  // Check if token is present
  if (!token) {
    return res.status(401).json({
      ok: false,
      isAuthenticated: false,
      message: "You are not authorized",
    });
  }

  try {
    // Verify the token and decode it
    const decodedToken = jwt.verify(token, secretKey); // 'secretKey' should be your actual JWT secret

    // Check if the token is valid and contains an ID
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({
        ok: false,
        isAuthenticated: false,
        message: "Invalid or expired token",
      });
    }

    // Extract user ID from decoded token
    const { id } = decodedToken;

    // Fetch the user from the database using the ID
    const user = await User.findById(id);

    if (user) {
      // If user is found, send the user details
      res.status(200).json({
        ok: true,
        isAuthenticated: true,
        user: { id: user._id, name: user.name, email: user.email }, // Adjust based on your user schema
      });
    } else {
      // If user is not found, send 404
      res
        .status(404)
        .json({ ok: false, isAuthenticated: false, message: "User not found" });
    }
  } catch (error) {
    // Catch any errors related to token verification or database issues
    console.error(error);
    return res.status(500).json({
      ok: false,
      isAuthenticated: false,
      message: "Server error or invalid token",
    });
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, profilePic, bio } = req.body;
  const { id } = req.params; // looged in user ID

  try {
    let user = await User.findById(id);

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user.password = password || user.password;

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
    return res
      .status(200)
      .json({ message: `User deleted successfully ${deletedUser.username}` });
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
  deleteUser,
  getAuthUser,
};
