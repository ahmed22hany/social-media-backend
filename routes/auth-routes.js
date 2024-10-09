const express = require("express");

const router = express.Router();

const { UserRegister, UserLogin, UserLogout } = require("../controllers/auth");
const { getUser, updateUser, deleteUser } = require("../controllers/user");
const { protectRoute } = require("../middleware/user-middleware");

router.delete("/users/:id", protectRoute, deleteUser);
router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.post("/logout", protectRoute, UserLogout);

router.get("/getUser", getUser);

router.put("/users/:id", protectRoute, updateUser);

module.exports = router;
