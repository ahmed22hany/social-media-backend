const express = require("express");
const router = express.Router();
const { followUser } = require("../controllers/follow.js");

router.post("/", followUser);

module.exports = router;
