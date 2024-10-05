const jwt = require("jsonwebtoken");

const User = require("../models/user-model");

const secretKey = "CLIENT_SECRET_KEY";

// get user
const getUSer = (req, res) => {
  const { token } = req.headers;

  if (!token) {
    return res
      .status(401)
      .json({ ok: false, message: "you are not authorized" });
  }

  const decodedToken = jwt.verify(token, secretKey);

  console.log(decodedToken);

  if (!decodedToken) {
    return res.status(401).json({ message: "you are not authorized" });
  }
  const { id } = decodedToken;

  const user = User.find({ id });

  if (user) {
    res.status(200).json();
  } else {
    res.status(404).json({ message: "user not found" });
  }
};

module.exports = {
  getUSer,
};
