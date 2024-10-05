const express = require("express");
const router = express.Router();
const { unfollowUser } = require("../controllers/unFollow");

router.post("/", unfollowUser);

module.exports = router;
