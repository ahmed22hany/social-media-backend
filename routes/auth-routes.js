const express = require("express");

const router = express.Router();

const { UserRegister, UserLogin, UserLogout } = require("../controllers/auth");
const { getUser } = require("../controllers/user");

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.post("/logout", UserLogout);

router.get("/getUser", getUser);

module.exports = router;
