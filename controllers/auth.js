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

    res.status(200).json({
      success: true,
      message: "Registration successful",
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

  if (!email || !password) {
    return res.status(400).send({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const checkUser = await User.findOne({ email });

    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    if (!bcrypt.compareSync(password, checkUser.password)) {
      return res.json({
        success: false,
        message: "Please update your password",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
        password: checkUser.password,
      },

      "CLIENT_SECRET_KEY", // need to be in .env file with secret key
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        id: checkUser._id,
        password: checkUser.password,
      },
    });

    await checkUser.save();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
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
