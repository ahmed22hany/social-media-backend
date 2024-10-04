const express = require("express");
const router = express.Route();
const followController = require("../controllers/follow");

router.post("/", followController);

module.exports = router;
