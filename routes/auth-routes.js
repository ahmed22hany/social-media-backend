const express = require("express");

const router = express.Router();

const { UserRegister, UserLogin, UserLogout } = require("../controllers/auth");
const { getUser,updateUser,deleteUser } = require("../controllers/user");

router.delete("/users/:id", deleteUser);
router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.post("/logout", UserLogout);

router.get("/getUser", getUser);

router.put('/users/:id', updateUser);

module.exports = router;
