const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const UserRegister = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ username, email, password: hashPassword });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      "CLIENT_SECRET_KEY", // Replace with your secret key
      { expiresIn: "60m" }
    );

    // Send response with token
    res.status(201).json({
      success: true,
      message: "Registered successfully",
      token, // Include the token in the response
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const UserLogin = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Check if the user exists
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist! Please register first",
      });
    }

    // Compare provided password with the stored hashed password
    const isPasswordValid = bcrypt.compareSync(password, checkUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate the JWT token
    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
      },
      "CLIENT_SECRET_KEY", // Replace with your actual secret key from .env file
      { expiresIn: "60m" } // Token expires in 60 minutes
    );

    // Send the response with the token
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token, // Include the token in the response
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
};

// logout
const UserLogout = (req, res) => {
  if (!req.headers.token) {
    console.log(req.headers.token);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  res.clearCookie("token", { httpOnly: true, secure: false });
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// middleware

module.exports = { UserRegister, UserLogin, UserLogout };
